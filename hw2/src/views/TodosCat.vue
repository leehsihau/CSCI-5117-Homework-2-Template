<template>
    <div class="todos">
        <router-link to="/todos">Go Home</router-link>

        <h1 v-if="!done">To-dos</h1>
        <h1 v-else>Finished To-dos</h1>
        <form v-if="!done" v-on:submit.prevent="addTodo(todo)">
            <input v-model="todo" placeholder="To-do">
            <button type="submit">Add To-do</button>
        </form>
        <div v-if="todos.length==0">
            <h3>category empty, add items to continue</h3>
        </div>
        <div v-else>
        <div v-for="(item, index) in filteredTodos" :key="index">
            <router-link :to="{path: '/todo/' + item.id }">
            <Todo :userId="user.uid" :todo="item" :category="$route.params.category" style="white-space: nowrap; overflow: hidden"/>
                </router-link></div>
        </div>
        <br/>
        <router-link class="toggle" v-if="!done" :to="{path: '/done/' + $route.params.category}">Show Finished Items</router-link>
        <router-link class="toggle" v-else :to="{path: '/todos/' + $route.params.category}">Show Unfinished Items</router-link>
    </div>
</template>

<script>
    import { auth, db } from "@/firebaseConfig"
    import Todo from '@/views/Todo.vue'
    export default {
        name: "TodosCat",
        components: {
            Todo
        },
        data() {
            return {
                user: "",
                todos: [],
                todo: "",
                category: ""
            }
        },
        props: {
            done: {
                type: Boolean,
                default: false
            },
        },
        computed: {
            filteredTodos: function() {
                console.log(this.todos);
                return this.todos.filter(i => i.done === this.done);
            }
        },
        created() {
            console.log("rinima: "+this.done)
                if(this.done==undefined){
                    this.$router.push("/404")
                }
        },
        beforeCreate: function() {
            auth.onAuthStateChanged(user => {
                this.user = user;
                if (!user) {
                    this.$router.push("/")
                } else {
                    this.$bind('todos', db.collection('users').doc(this.user.uid).collection('todos').where('category', '==', this.$route.params.category));

                }
            })
        },
        methods: {
            addTodo(todo) {
                let createdAt = new Date();
                let done = false;
                let currentUid=this.user.uid;
                console.log("uid1: "+currentUid);
                let category=this.$route.params.category;
                db.collection("users").doc(currentUid).collection("categories").doc(category).set({done: true, category: category}, {merge: true});
                db.collection('users').doc(currentUid).collection('todos').add({todo, createdAt, done, category});
            }
        },
    }
</script>

<style scoped>
    a.toggle {
        display: inline-block;
        padding: 10px;
        border: 1px solid lightgray;
    }
</style>