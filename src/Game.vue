<template>
    <div id="app" class="container game">

        <div class="row" v-if="showTable">
            <div class="col-3">
                <CardComponent
                    v-bind:card="card"
                    @is-loaded="setCardIsLoaded"
                />
            </div>
            <div class="col-3">
                <div class="question">
                    Next card will be?
                </div>

                <div class="pt-3">
                    <ButtonsComponent
                        v-bind:card="card"
                        @user-answer="takeAnswer"
                    />
                </div>

                <div v-if="answer && cardIsLoaded">
                    <ResultsComponent
                        v-bind:history="history"
                    />
                </div>
            </div>

            <div class="col-6">
                <div v-if="showScores">
                    <RoundHistoryComponent
                        v-bind:history="history"
                        v-bind:maxRounds="maxRounds"
                    />

                    <ScoreTableComponent
                        v-bind:history="history"
                    />
                </div>
            </div>
        </div>

       <ModalContinueComponent
           v-bind:modalContinue="modalContinue"
           @continue-game="continueGame"
       />

        <ModalGameOverComponent
            v-bind:modalGameOver="modalContinue"
        />
    </div>
</template>

<script>

import CardComponent from "@/components/CardComponent";
import ButtonsComponent from "@/components/ButtonsComponent";
import ResultsComponent from "@/components/ResultsComponent";
import RoundHistoryComponent from "@/components/RoundHistoryComponent"
import ScoreTableComponent from "@/components/ScoreTableComponent";
import ModalContinueComponent from "@/components/ModalContinueComponent";
import ModalGameOverComponent from "@/components/ModalGameOverComponent";
import VueCookies from "vue-cookies"

export default {
    name: 'App',
    components: {
        CardComponent: CardComponent,
        ButtonsComponent: ButtonsComponent,
        ResultsComponent: ResultsComponent,
        RoundHistoryComponent: RoundHistoryComponent,
        ScoreTableComponent: ScoreTableComponent,
        ModalContinueComponent: ModalContinueComponent,
        ModalGameOverComponent: ModalGameOverComponent
    },
    data() {
        return {
            maxRounds: 20,
            showTable: false,
            deck: null,
            card: false,
            answer: null,
            winner: null,
            cardIsLoaded: false,
            roundsHistory: [],
            history: [],
            acceptedAnswers: {
                younger: 'younger',
                older: 'older'
            },
            modalContinue: false,
            modalGameOver: false
        }
    },
    computed: {
        round() {
            let round = 0
            if (this.history) {
                round = this.history.length - 1
            }

            return round
        },
        showScores() {
            if (this.round===0 && this.winner===null){
                return false
            } else if (this.answer) {
                return true
            }

            return false
        }
    },
    watch: {

    },
    created: function () {
        this.createDeck()
        this.modalContinue = VueCookies.isKey('history')

        if (!this.modalContinue) {
            this.showTable = true
            this.getData()
        }
    },
    methods: {
        createDeck() {
            const deck = [{}, {}]
            for (let i = 2; i < 11; i++) {
                deck.push(i)
            }
            deck.push('JACK', 'QUEEN', 'KING', 'ACE')

            this.deck = deck
        },
        getData() {
            const param = {
                url: 'https://deckofcardsapi.com/api/deck/new/draw/?count=1',
                method: 'GET',
            }

            // eslint-disable-next-line no-undef
            axios(param)
                .then(response => {
                    this.createCardObject(response)
                    this.addHistory()

                    if (this.answer) {
                        this.roundResult()
                    }

                }).catch(error => {
                    console.info(error)
                })
        },
        loadData() {
            this.history = this.getHistory()

            const lastItem = this.history[this.history.length - 1]
            this.card = lastItem.card
            this.answer = lastItem.answer
            this.winner = lastItem.winner
        },
        createCardObject(response) {
            this.card = {
                image: response.data.cards[0].image,
                value: response.data.cards[0].value
            }
        },
        addHistory() {
            this.history.push({
                card: this.card,
                oldCard: null,
                winner: null
            })
        },
        updateHistory() {
            const index = this.round
            this.history[index].oldCard = this.getOldCard()
            this.history[index].winner = this.winner
            this.history[index].answer = this.answer
        },
        getHistory() {
            const history = VueCookies.get('history');
            return JSON.parse(history)
        },
        roundResult: function () {
            this.winner = this.isWinner()

            this.updateHistory()
            this.setCookies()
        },
        isWinner() {
            const oldCard = this.getOldCard()
            const oldCardIndex = this.getCardIndex(oldCard)

            const newCard = this.getNewCard()
            const newCardIndex = this.getCardIndex(newCard)

            if (oldCardIndex === newCardIndex) {
                this.history.pop()
                return null
            }

            switch (this.answer) {
                case this.acceptedAnswers.younger:
                    return newCardIndex < oldCardIndex
                case this.acceptedAnswers.older:
                    return newCardIndex > oldCardIndex
            }
        },
        getOldCard() {
            const historyItem = this.history[this.history.length - 2]

            return historyItem.card
        },
        getNewCard() {
            const historyItem = this.history[this.history.length - 1]

            return historyItem.card
        },
        getCardIndex(card) {
            const cardValue = isNaN(card.value) ? card.value : parseInt(card.value)
            const cardObj = this.deck.find(myCard => myCard === cardValue)

            return this.deck.indexOf(cardObj)
        },
        takeAnswer(e) {
            this.answer = e
            this.card = false
            this.cardIsLoaded = false
            this.getData()
        },
        setCardIsLoaded() {
            this.cardIsLoaded = true
        },
        setCookies() {
            VueCookies.set('history', JSON.stringify(this.history), "1h")
        },


        continueGame(e) {
            if (e) {
                this.loadData()
                this.modalContinue = false
                this.showTable = true
            } else {
                this.cancelGame()
            }

        },
        cancelGame() {
            VueCookies.remove('history')
            this.history = []
            this.answer = null
            this.showTable = true
            this.modalContinue = false
            this.getData()

        },
        newGame() {
            VueCookies.remove('history')
            this.history = []
            this.answer = null
            this.showTable = true
            this.modalGameOver = false
        },

    }

}
</script>

<style lang="scss">

@import './sass/app.scss';

</style>