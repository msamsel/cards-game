<template>
    <div id="app" class="container game">

        <div class="row">
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
                        v-bind:winner="winner"
                        v-bind:isLuckyMan="isLuckyMan"
                    />
                </div>
            </div>

            <div class="col-6">
                <div v-if="answer && cardIsLoaded">
                    <RoundHistoryComponent
                        v-bind:maxRounds="maxRounds"
                        v-bind:round="round"
                        v-bind:points="points"
                    />

                    <ScoreTableComponent
                        v-bind:history="history"
                    />

                </div>
            </div>
        </div>
    </div>
</template>

<script>

import CardComponent from "@/components/CardComponent";
import ButtonsComponent from "@/components/ButtonsComponent";
import ResultsComponent from "@/components/ResultsComponent";
import RoundHistoryComponent from "@/components/RoundHistoryComponent"
import ScoreTableComponent from "@/components/ScoreTableComponent";

export default {
    name: 'App',
    components: {
        CardComponent: CardComponent,
        ButtonsComponent: ButtonsComponent,
        ResultsComponent: ResultsComponent,
        RoundHistoryComponent: RoundHistoryComponent,
        ScoreTableComponent: ScoreTableComponent
    },
    data() {
        return {
            deck: null,
            card: false,
            answer: null,
            winner: false,
            cardIsLoaded: false,
            roundsHistory: [],
            history: [],
            maxRounds: 20,
            points: 0,
            acceptedAnswers: {
                younger: 'younger',
                older: 'older'
            }
        }
    },
    computed: {
        isLuckyMan: function () {
            const newCard = this.getNewCard()
            const newCardIndex = this.getCardIndex(newCard.card)
            const luckyIndex = [2, 14]

            return luckyIndex.find(index => index === newCardIndex)
        },
        round: function () {
            return this.history.length - 1
        }
    },
    created: function () {
        this.createDeck()
        // this.modalContinue = VueCookies.isKey('roundsHistory')

        this.getData()
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
                console.info(error);
            })
        },
        createCardObject(response) {
            this.card = {
                image: response.data.cards[0].image,
                value: response.data.cards[0].value
            }
        },
        addHistory() {
            this.history.push({
                answer: this.answer ? this.answer : null,
                card: this.card,
            })
        },
        updateHistory(index, data) {
            this.history[index].winner = data
            const oldCard = this.getOldCard()
            this.history[index].oldCard = oldCard.card
        },
        roundResult: function () {
            this.winner = this.isWinner()
            this.updateHistory(this.round, this.winner);
            if (this.winner) {
                this.points = this.points + 0.1
            }
        },
        isWinner() {
            const oldCard = this.getOldCard()
            const oldCardIndex = this.getCardIndex(oldCard.card)

            const newCard = this.getNewCard()
            const newCardIndex = this.getCardIndex(newCard.card)

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
            return this.history[this.history.length - 2]
        },
        getNewCard() {
            return this.history[this.history.length - 1]
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
        }
    }

}
</script>

<style lang="scss">

@import './sass/app.scss';

</style>