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
                        @user-answer="setAnswer"
                    />
                </div>

                <div v-if="cardIsLoaded">
                    <ResultsComponent
                        v-if="answer"
                        v-bind:history="history"
                    />
                    <MessageComponent
                        v-bind:has-lucky="hasLucky"
                        v-bind:is-equal="cardsEqual"
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
            v-bind:modalGameOver="modalGameOver"
            v-bind:history="history"
            @new-game="newGame"
        />
    </div>
</template>

<script>

import CardComponent from "@/components/CardComponent";
import ButtonsComponent from "@/components/ButtonsComponent";
import ResultsComponent from "@/components/ResultsComponent";
import RoundHistoryComponent from "@/components/RoundHistoryComponent"
import MessageComponent from "@/components/MessageComponent";
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
        ModalGameOverComponent: ModalGameOverComponent,
        MessageComponent: MessageComponent
    },

    data() {
        return {
            maxRounds: 5,
            deck: null,
            gameRound: 0,
            card: false,
            oldCard: false,
            answer: null,
            winner: null,
            history: [],
            showTable: false,
            cardIsLoaded: false,
            modalContinue: false,
            acceptedAnswers: {
                younger: 'younger',
                older: 'older'
            }
        }
    },

    computed: {
        cardsEqual() {
            const item = this.getHistoryItem()
            if (item) {
                return item.winner === null
            }

            return false
        },
        hasLucky() {
            const item = this.getHistoryItem()
            const luckyIndex = [2, 'ACE']
            if (item) {
                const cardValue = isNaN(item.card.value) ? item.card.value : parseInt(item.card.value)
                return luckyIndex.find(index => index === cardValue)
            }

            return false
        },
        showScores() {
            if (this.gameRound === 0 && this.winner === null){
                return false
            } else if (this.answer && this.gameRound > 0 || this.winner === null && this.gameRound > 0) {
                return true
            }

            return false
        },
        modalGameOver() {
            if (this.gameRound === this.maxRounds && this.cardIsLoaded) {
                return true
            }

            return false
        }
    },

    created: function () {
        this.createDeck()
        this.modalContinue = this.isCookies()

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
                    this.setCard(response)
                    
                    if (this.answer) {
                        this.roundResult()
                    }
                }).catch(error => {
                    console.info(error)
                })
        },
        loadData() {
            this.loadHistory()
            const lastItem = this.getHistoryItem()
            
            this.gameRound = lastItem.gameRound
            this.card = lastItem.card
            this.oldCard = lastItem.oldCard
            this.answer = lastItem.answer
            this.winner = lastItem.winner
        },

        roundResult () {
            this.addRound()
            this.setWinner()
            this.setHistory()
            this.setCookies()
        },

        setHistory() {
            this.history.push({
                gameRound: this.getRound(),
                card: this.getCard(),
                oldCard: this.getOldCard(),
                winner: this.getWinner(),
                answer: this.getAnswer()
            })
        },
        getHistory() {
            const history = this.getCookies()
            return JSON.parse(history)
        },
        loadHistory() {
            this.history = this.getHistory()
        },
        getHistoryItem(gameRound = false) {
            if (!gameRound) {
                gameRound = this.history.length - 1
            }
            return this.history[gameRound]
        },

        setWinner() {
            const newCard = this.getCard()
            const newCardIndex = this.getCardIndex(newCard)

            const oldCard = this.getOldCard()
            const oldCardIndex = this.getCardIndex(oldCard)

            if (oldCardIndex === newCardIndex) {
                this.winner = null
            }

            switch (this.answer) {
                case this.acceptedAnswers.younger:
                    this.winner = newCardIndex < oldCardIndex
                    break
                case this.acceptedAnswers.older:
                    this.winner =  newCardIndex > oldCardIndex
                    break
            }
        },
        getWinner() {
            return this.winner
        },

        addRound() {
            this.gameRound++
        },
        getRound() {
            return this.gameRound
        },

        setCard(response) {
            this.card = {
                image: response.data.cards[0].image,
                value: response.data.cards[0].value
            }
        },
        getCard() {
            return this.card
        },
        getOldCard() {
            return this.oldCard
        },
        getCardIndex(card) {
            const cardValue = isNaN(card.value) ? card.value : parseInt(card.value)
            const cardObj = this.deck.find(myCard => myCard === cardValue)

            return this.deck.indexOf(cardObj)
        },
        setCardIsLoaded() {
            this.cardIsLoaded = true
        },

        setAnswer(e) {
            this.answer = e

            this.oldCard = this.card
            this.card = false
            this.cardIsLoaded = false

            this.getData()
        },
        getAnswer() {
            return this.answer
        },

        setCookies() {
            VueCookies.set('history', JSON.stringify(this.history), "1h")
        },
        getCookies() {
            return VueCookies.get('history')
        },
        isCookies() {
            return VueCookies.isKey('history')
        },
        removeCookies() {
            VueCookies.remove('history')
        },

        continueGame(e) {
            if (e) {
                this.loadData()
                this.modalContinue = false
                this.showTable = true
            } else {
                this.resetGame()
                this.removeCookies()
                this.getData()
            }
        },
        
        newGame() {
            this.resetGame()
            this.removeCookies()
            this.getData()
        },
        resetGame() {
            this.gameRound = 0
            this.card = false
            this.oldCard =  false
            this.answer = null
            this.winner = null
            this.history = []
        }
    }
}
</script>

<style lang="scss">

@import './sass/app.scss';

</style>