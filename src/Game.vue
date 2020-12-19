<template>
    <div id="app" class="container game">
        <div v-if="card" class="row">
            <div class="col-3">
                <CardComponent
                    v-bind:card="card"
                />
            </div>
        </div>
    </div>
</template>

<script>
import CardComponent from "@/components/CardComponent";

export default {
    name: 'App',
    components: {
        CardComponent: CardComponent
    },
    data() {
        return {
            card: {}
        }
    },
    computed: {
        canBeYounger: function() {
            if (this.card) {
                return this.card.value !== '2'
            } else return false
        },
        canBeOlder: function () {
            if (this.card) {
                return this.card.value !== 'ACE'
            } else return false
        }
    },
    created: function () {
        // this.deck = this.createDeck()
        // this.modalContinue = VueCookies.isKey('roundsHistory')

        this.getData()
    },
    methods: {
        getData() {
            // this.resetData()

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
            this.createCardObject(response)

            // if (this.answer) {
            //     this.makeWinner(this.answer);
            //     this.makePoints()
            //     this.createHistory()
            //     this.setCookies()
            // }
            //
            // if (this.round === this.maxRounds) {
            //     this.modalGameOver = true;
            // }
        },

        createCardObject(response) {
            this.card = {
                image: response.data.cards[0].image,
                value: response.data.cards[0].value
            }
        },
    }

}
</script>

<style lang="scss">

@import './sass/app.scss';

</style>