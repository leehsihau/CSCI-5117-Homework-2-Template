<template>
    <div class="auth">

        <div v-if="!user">
            <a href @click.prevent="signInWithGoogle">Sign in with Google</a>
        </div>

        <div v-if="user">
            <a href @click.prevent="signOut">Sign Out</a>
        </div>
    </div>
</template>

<script>
    import { auth, provider } from "@/firebaseConfig";
    export default {
        name: "auth",
        data() {
            return {
                user: null
            };
        },
        beforeCreate: function() {
            auth.onAuthStateChanged(user => {
                if (user) {
                    this.user = user;
                }
            });
        },
        methods: {
            signInWithGoogle: function() {
                auth
                    .signInWithRedirect(provider)
                    .then(result => {
                        this.user = result.user;
                        console.log("?", this.user);
                    })
                    .catch(err => console.log(err));
            },
            signOut: function() {
                auth
                    .signOut()
                    .then(() => {
                        this.user = null;
                    })
                    .catch(err => console.log(err));
            }
        }
    };
</script>

<style scoped>
    div.auth {
        display: inline-block;
        padding: 10px;
        border: 1px solid lightgray;
    }
</style>