<template>
    <div v-if="card" class="row">
        <!-- card component -->
        <div class="col-3">
            <div v-show="!cardIsLoaded" class="picking-card">Picking a card...</div>
            <img v-show="cardIsLoaded" v-bind:src="card.image" @load="onImgLoad">
        </div>

        <div class="col-3">
            <div class="question">
                Next card will be?
            </div>
            <div class="pt-3">

                <!-- buttons component -->
                <div class="pt-3">
                    <b-button @click="assertYounger()" variant="outline-light" size="lg"
                              v-bind:disabled="!canBeYounger">
                        Younger
                    </b-button>
                    &nbsp;
                    <b-button @click="assertOlder()" variant="outline-light" size="lg" v-bind:disabled="!canBeOlder">
                        Older
                    </b-button>
                </div>

                <!-- results component -->
                <div class="result-message" v-if="answer && cardIsLoaded" v-bind:class="[winner ? 'win' : 'loose']">
                    <span v-if="winner">
                        You win!
                    </span>
                    <span v-else>
                        You loose
                    </span>
                </div>
                <div class="lucky" v-show="luckyMan && cardIsLoaded">
                    Instant win!
                </div>

            </div>
        </div>
        <div class="col-6">

            <!-- score table component -->
            <div v-show="round" class="score-table">
                <div class="float-right">Points: {{ myPoints }}</div>
                <div class="">Round: {{ round }} of {{ maxRounds }}</div>
            </div>

            <!-- round history component-->
            <b-list-group v-if="answer || roundsHistory">
                <b-list-group-item class="bg-dark text-white" v-for="(item, key) in roundsHistory" :key="key">
                    {{ item.newCard }} {{ item.answer === 'older' ? 'is older' : 'is younger' }}
                    than {{ item.oldCard }} - {{ item.winner ? 'you won!' : 'you loosed...' }}
                </b-list-group-item>
            </b-list-group>
        </div>

        <!--modal continue component -->
        <b-modal
            v-model="modalContinue"
            hide-header
            no-close-on-backdrop
        >
            <h4 class="pt-3">Do you want to continue the game?</h4>

            <template #modal-footer="">
                <b-button variant="success" @click="continueGame()">
                    Yes
                </b-button>
                <b-button variant="danger" @click="cancelGame()">
                    No
                </b-button>
            </template>
        </b-modal>

        <!--modal game over component -->
        <b-modal
            v-model="modalGameOver"
            title="Game Over"
            hide-header
            no-close-on-backdrop
        >
            <h4 class="pt-3">Game Over<br>You get {{ myPoints }} points</h4>

            <template #modal-footer="">
                <b-button variant="success" @click="newGame()">
                    New game
                </b-button>

            </template>
        </b-modal>

    </div>
</template>

<script lang="js">

import VueCookies from "vue-cookies"

const MAX_ROUNDS = 30

export default {
    name: "Game",
    data() {
        return {
            deck: [],
            cardIsLoaded: false,
            modalContinue: false,
            modalGameOver: false,
            card: {},
            oldCard: {},
            cardsObj: {},
            answer: null,
            winner: null,
            canBeYounger: false,
            canBeOlder: false,
            luckyMan: false,
            luckyIndex: [2, 14],
            roundsHistory: [],
            points: 0,
            maxRounds: MAX_ROUNDS
        }
    },

    computed: {
        round() {
            return this.roundsHistory.length
        },

        myPoints() {
            return this.points.toFixed(1)
        }
    },

    created: function () {
        this.deck = this.createDeck()
        this.modalContinue = VueCookies.isKey('roundsHistory')

        this.getData()
    },

    methods: {
        getData() {
            this.resetData()

            const param = {
                url: 'https://deckofcardsapi.com/api/deck/new/draw/?count=1',
                method: 'GET',
            };

            // eslint-disable-next-line no-undef
            axios(param)
                .then(response => {
                    this.results(response)
                }).catch(error => {
                console.info(error);
            });
        },

        results(response) {

            this.makeCard(response)

            if (this.answer) {
                this.makeWinner(this.answer);
                this.makePoints()
                this.createHistory()
                this.setCookies()
            }

            if (this.round === this.maxRounds) {
                this.modalGameOver = true;
            }
        },

        createDeck() {
            //console.log([...Array(10)].map((_, i) => {if (i > 0) return i + 1}))
            const deck = [{}, {}]
            for (let i = 2; i < 11; i++) {
                deck.push(i)
            }

            deck.push('JACK', 'QUEEN', 'KING', 'ACE')

            return deck
        },

        assertYounger() {
            this.answer = 'younger'
            this.oldCard = this.card
            this.cardIsLoaded = false
            this.getData()
        },

        assertOlder() {
            this.answer = 'older'
            this.oldCard = this.card
            this.cardIsLoaded = false
            this.getData()
        },

        getNewCard() {
            const newCard = isNaN(this.card.value) ? this.card.value : parseInt(this.card.value);
            const newCardObj = this.deck.find(card => card === newCard)
            const newCardIndex = this.deck.indexOf(newCardObj);

            return {newCardIndex: newCardIndex, newCardObj: newCardObj}
        },

        getOldCard() {
            const oldCard = isNaN(this.oldCard.value) ? this.oldCard.value : parseInt(this.oldCard.value);
            const oldCardObj = this.deck.find(card => card === oldCard)
            const oldCardIndex = this.deck.indexOf(oldCardObj);

            return {oldCardIndex: oldCardIndex, oldCardObj: oldCardObj}
        },

        onImgLoad() {
            this.cardIsLoaded = true
        },

        continueGame() {
            const history = VueCookies.get('roundsHistory');

            this.roundsHistory = JSON.parse(history)
            this.roundsHistory.forEach(item => {
                this.points += item.winner ? 0.1 : 0;
            })

            this.modalContinue = false
        },

        cancelGame() {
            VueCookies.remove('roundsHistory')
            this.modalContinue = false
        },

        newGame() {
            VueCookies.remove('roundsHistory')
            this.roundsHistory = []
            this.points = 0
            this.answer = false
            this.modalGameOver = false
        },
        //    ---------------
        makeWinner: function (answer) {
            const newCard = this.getNewCard()
            const oldCard = this.getOldCard()

            this.luckyMan = this.makeLuckyMan(newCard);

            if (answer === 'younger') {
                this.winner = newCard.newCardIndex < oldCard.oldCardIndex
            } else {
                this.winner = newCard.newCardIndex > oldCard.oldCardIndex
            }
        },
        makeCard(response) {
            this.card = {
                image: response.data.cards[0].image,
                value: response.data.cards[0].value
            }

            this.canBeYounger = this.card.value !== '2'
            this.canBeOlder = this.card.value !== 'ACE'
        },
        makePoints() {
            if (this.winner) {
                this.points = this.points + 0.1
            }
        },
        makeLuckyMan(newCard) {
            return this.luckyIndex.find(index => index === newCard.newCardIndex)
        },
        resetData() {
            this.luckyMan = false
            this.canBeYounger = false
            this.canBeOlder = false
        },
        createHistory() {
            const newCard = this.getNewCard()
            const oldCard = this.getOldCard()

            this.roundsHistory.push({
                'answer': this.answer,
                'winner': this.winner,
                'oldCard': oldCard.oldCardObj,
                'newCard': newCard.newCardObj
            })
        },
        setCookies() {
            VueCookies.set('roundsHistory', JSON.stringify(this.roundsHistory), "1h")
        }
    }
}
</script>

<style scoped>

</style>
