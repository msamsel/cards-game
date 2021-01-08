<template>
    <div id="app" class="container game">

        <div class="row" v-if="showGameTable">
            <div class="col-3">
                <CardComponent
                    v-bind:card="card"
                    @is-loaded="setCardIsLoaded(true)"
                />
            </div>
            <div class="col-3">
                <div class="question">
                    Next card will be?
                </div>

                <div class="pt-3">
                    <ButtonsComponent
                        v-bind:card="card"
                        @user-answer="prepareAnswer"
                    />
                </div>

                <div v-if="cardIsLoaded">
                    <ResultsComponent
                        v-if="!cardsAreEqual && gameRound"
                        v-bind:history="history"
                    />
                    <MessageComponent
                        v-bind:has-lucky="hasLucky"
                        v-bind:is-equal="cardsAreEqual"
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
            maxRounds: 20,
            deck: null,
            gameRound: 0,
            card: false,
            oldCard: false,
            answer: null,
            winner: null,
            history: [],
            cardsStack: [],

            showGameTable: false,
            cardIsLoaded: false,
            modalContinue: false,
            acceptedAnswers: {
                younger: 'younger',
                older: 'older'
            }
        }
    },

    computed: {
        cardsAreEqual() {
            const stack = this.getCardsStack()
            const card = stack[stack.length - 1]
            const oldCard = stack[stack.length - 2]

            return oldCard && card.value === oldCard.value
        },
        hasLucky() {
            const stack = this.getCardsStack()
            const card = stack[stack.length - 1]
            const luckyIndex = [2, 'ACE']
            
            if (card) {
                const cardValue = isNaN(card.value) ? card.value : parseInt(card.value)
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
            return this.gameRound === this.maxRounds && this.cardIsLoaded;
        }
    },

    created: function () {
        this.createDeck()
        this.modalContinue = this.isCookies()

        if (!this.modalContinue) {
            this.setShowGameTable(true)
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
                    const card = this.createCard(response)
                    this.addToCardsStack(card)

                    if (this.getAnswer()) {
                        this.roundResult()
                    }
                }).catch(error => {
                    console.info(error)
                })
        },
        loadData() {
            this.loadHistory()
            const lastItem = this.getHistoryItem()

            this.setGameRound(lastItem.gameRound)
            this.setCard(lastItem.card)
            this.setOldCard(lastItem.oldCard)
            this.setAnswer(lastItem.answer)
            this.setWinner(lastItem.winner)
        },

        roundResult () {
            if (!this.cardsAreEqual) {
                this.addGameRound()
                this.makeWinner()
                this.setHistory()
                this.setCookies()
            }
        },

        setHistory() {
            this.history.push({
                gameRound: this.getGameRound(),
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
        resetHistory() {
            this.history = []
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

        makeWinner() {
            const newCard = this.getCard()
            const newCardIndex = this.getCardIndex(newCard)

            const oldCard = this.getOldCard()
            const oldCardIndex = this.getCardIndex(oldCard)

            if (oldCardIndex === newCardIndex) {
                this.setWinner(null)
            }

            switch (this.getAnswer()) {
                case this.acceptedAnswers.younger:
                    this.setWinner(newCardIndex < oldCardIndex)
                    break
                case this.acceptedAnswers.older:
                    this.setWinner(newCardIndex > oldCardIndex)
                    break
            }
        },
        setWinner(winner) {
            this.winner = winner
        },
        getWinner() {
            return this.winner
        },

        addGameRound() {
            this.gameRound++
        },
        setGameRound(gameRound) {
            this.gameRound = gameRound
        },
        getGameRound() {
            return this.gameRound
        },

        createCard(response) {
            this.card = {
                image: response.data.cards[0].image,
                value: response.data.cards[0].value
            }

            return this.card
        },
        setCard(card) {
            this.card = card
        },
        getCard() {
            return this.card
        },
        setOldCard(card) {
            this.oldCard = card
        },
        getOldCard() {
            return this.oldCard
        },
        getCardIndex(card) {
            const cardValue = isNaN(card.value) ? card.value : parseInt(card.value)
            const cardObj = this.deck.find(myCard => myCard === cardValue)
            
            return this.deck.indexOf(cardObj)
        },
        setCardIsLoaded(loaded) {
            this.cardIsLoaded = loaded
        },

        addToCardsStack(card) {
            this.cardsStack.push(card)
        },
        getCardsStack() {
            return this.cardsStack
        },

        setAnswer(answer) {
            this.answer = answer
        },
        getAnswer() {
            return this.answer
        },
        prepareAnswer(answer) {
            this.setAnswer(answer)
            this.setOldCard(this.card)
            this.setCard(false)
            this.setCardIsLoaded(false)
            this.getData()
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

        continueGame(continueGame) {
            this.setShowModalContinue(false)
            this.setShowGameTable(true)

            if (continueGame) {
                this.loadData()
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
            this.setGameRound(0)
            this.setCard(false)
            this.setOldCard(false)
            this.setAnswer(null)
            this.setWinner(null)
            this.resetHistory(null)
        },

        setShowGameTable(show) {
            this.showGameTable = show
        },
        setShowModalContinue(show) {
            this.modalContinue = show
        },

    }
}
</script>

<style lang="scss">

@import './sass/app.scss';

</style>