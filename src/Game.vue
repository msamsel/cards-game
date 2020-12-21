<template>
    <div id="app" class="container game">

        <div class="row">
            <div class="col-3">
                <CardComponent v-bind:card="card"/>
            </div>
            <div class="col-3">
                <div class="question">
                    Next card will be?
                </div>

                <div class="pt-3">
                    <ButtonsComponent
                        v-bind:can-be-younger="canBeYounger"
                        v-bind:can-be-older="canBeOlder"
                        @make-answer="makeAnswer"
                    />
                </div>

                <ResultsComponent
                    v-bind:answer="answer"
                    v-bind:winner="winner"
                    v-bind:isLuckyMan="isLuckyMan"
                />

            </div>

        </div>
    </div>
</template>

<script>

import CardComponent from "@/components/CardComponent";
import ButtonsComponent from "@/components/ButtonsComponent";
import ResultsComponent from "@/components/ResultsComponent";
import VueCookies from "vue-cookies";

export default {
    name: 'App',
    components: {
        CardComponent: CardComponent,
        ButtonsComponent: ButtonsComponent,
        ResultsComponent: ResultsComponent
    },
    data() {
        return {
            deck: [{}, {}],
            card: false,
            oldCard: false,
            answer: null,
            winner: null,
            cardIsLoaded: true,
            roundsHistory: [],
            maxRounds: 20
        }
    },
    computed: {
        canBeYounger: function () {
            if (this.card) {
                return this.card.value !== '2'
            } else return false
        },
        canBeOlder: function () {
            if (this.card) {
                return this.card.value !== 'ACE'
            } else return false
        },
        isLuckyMan: function () {
            const newCard = this.getNewCard()
            const luckyIndex = [2, 14]
            return luckyIndex.find(index => index === newCard.newCardIndex)
        }
    },
    created: function () {
        this.createDeck()
        // this.modalContinue = VueCookies.isKey('roundsHistory')

        this.getData()
    },
    methods: {
        createDeck() {
            //console.log([...Array(10)].map((_, i) => {if (i > 0) return i + 1}))
            for (let i = 2; i < 11; i++) {
                this.deck.push(i)
            }
            this.deck.push('JACK', 'QUEEN', 'KING', 'ACE')
        },
        getData() {
            // this.resetData()

            const param = {
                url: 'https://deckofcardsapi.com/api/deck/new/draw/?count=1',
                method: 'GET',
            };

            // eslint-disable-next-line no-undef
            axios(param)
                .then(response => {
                    this.createCardObject(response)
                    this.results()
                }).catch(error => {
                console.info(error);
            });
        },
        results() {
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
        createCardObject(response) {
            this.card = {
                image: response.data.cards[0].image,
                value: response.data.cards[0].value
            }
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

        makeAnswer(e) {
            this.answer = e
            this.oldCard = this.card
            this.card = false
            this.getData()
        },

        makeWinner: function (answer) {
            const newCard = this.getNewCard()
            const oldCard = this.getOldCard()

            if (answer === 'younger') {
                this.winner = newCard.newCardIndex < oldCard.oldCardIndex
            } else {
                this.winner = newCard.newCardIndex > oldCard.oldCardIndex
            }
        },

        makePoints() {
            if (this.winner) {
                this.points = this.points + 0.1
            }
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

<style lang="scss">

@import './sass/app.scss';

</style>