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

        </div>
    </div>
</template>

<script>

import CardComponent from "@/components/CardComponent";
import ButtonsComponent from "@/components/ButtonsComponent";
import ResultsComponent from "@/components/ResultsComponent";

export default {
    name: 'App',
    components: {
        CardComponent: CardComponent,
        ButtonsComponent: ButtonsComponent,
        ResultsComponent: ResultsComponent
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
            acceptedAnswers: {
                younger: 'younger',
                older: 'older'
            }
        }
    },
    computed: {
        isLuckyMan: function () {
            // const newCard = this.getNewCard()
            // const luckyIndex = [2, 14]
            //
            // return luckyIndex.find(index => index === newCard.newCardIndex)
            return true
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
                    this.updateHistory()

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
        updateHistory() {
            this.history.push({
                answer: this.answer ? this.answer : null,
                card: this.card
            })
        },
        roundResult: function () {
            this.winner = this.setWinner()

            if (this.winner) {
                this.points = this.points + 0.1
            }
        },

        setWinner() {
            const historyLength = this.history.length
            const oldCard = this.history[historyLength - 2]
            const newCard = this.history[historyLength - 1]
            const oldCardIndex = this.getCardIndex(oldCard.card)
            const newCardIndex = this.getCardIndex(newCard.card)

            switch (this.answer) {
                case this.acceptedAnswers.younger:
                    return newCardIndex < oldCardIndex
                case this.acceptedAnswers.older:
                    return newCardIndex > oldCardIndex
            }

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