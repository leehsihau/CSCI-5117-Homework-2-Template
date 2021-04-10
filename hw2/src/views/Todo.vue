<template>
    
    <div class="todo">
        <div v-if="todo" class="box">
            {{ todo.todo }}
        </div>
        <button v-if="!todo.done" @click.prevent="markAsDone(todo.id)">Done!</button>
        <router-link class="return" v-if="this.$route.params.id" to="/todos">Go Back</router-link>
        <br/>
        <br/>
        <form v-if="this.$route.params.id" v-on:submit.prevent="updateTodo(todo)">
            <input v-model="todo.todo">
            <button type="submit">Update To-do</button>
        </form>

    </div>
</template>

<script>
    import { auth, db } from "@/firebaseConfig"
    export default {
        name: "Todo",
        data() {
            return {
                user: "",
            }
        },
        props: {
            todo: Object,
            userId: String, 
            category: String
        },
        beforeCreate: function() {
            if (this.$route.params.id) {
                auth.onAuthStateChanged(user => {
                    this.user = user;
                    if (!user) {
                        this.$router.push("/")
                    } else {
                        console.log("rnm beforeCreate: "+this.user);
                        this.$bind('todo', db.collection('users').doc(this.user.uid).collection('todos').doc(this.$route.params.id));
                    }
                })
            }
        },
       
        methods: {
            markAsDone(id) {
                let done = true;
                let placeholder=undefined;
                if(this.userId==undefined){
                    placeholder=this.user.uid;
                }else{
                    placeholder=this.userId;
                }
                console.log("category: "+this.category);
                db.collection('users').doc(placeholder).collection('todos').doc(id).update({done});
                db.collection('users').doc(placeholder).collection('todosCat').doc(this.category).collection(this.category).doc(id).update({done});

            },
            updateTodo(todo) {
                let placeholder=undefined;
                if(this.userId==undefined){
                    placeholder=this.user.uid;
                }else{
                    placeholder=this.userId;
                }
                db.collection('users').doc(placeholder).collection('todos').doc(todo.id).update(todo);
                db.collection('users').doc(placeholder).collection('todosCat').doc(this.category).collection(this.category).doc(todo.id).update(todo);

            },
        },
        computed: {
                
        }
    }
</script>

<style scoped>
    .box {
        display: block;
        padding: 10px;
        border: 1px solid lightgrey;
        text-align: left;
        margin: 10px 0px;
    }
    .todo {
        width: 30em;
        margin: 10px auto;
    }
    .return {
        margin: 20px;
    }
</style>