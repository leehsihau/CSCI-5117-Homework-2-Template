<template>
    <div class="todos">
        <h1 v-if="!done">To-dos</h1>
        <h1 v-else>Finished To-dos</h1>
        <form v-if="!done" v-on:submit.prevent="addTodo(todo)">
            <input v-model="todo" placeholder="To-do">
            <button type="submit">Add To-do</button>
        </form>
        <div v-for="(item, index) in filteredTodos" :key="index">
            <router-link :to="{path: '/todo/' + item.id }">
            <Todo :userId="user.uid" :todo="item" :category="$route.params.category" style="white-space: nowrap; overflow: hidden"/>
                </router-link></div>
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
                    this.$bind('todos', db.collection('users').doc(this.user.uid).collection('todosCat').doc(this.$route.params.category).collection(this.$route.params.category).orderBy('createdAt', 'desc'));
                }
            })
        },
        methods: {
            addTodo(todo) {
                let createdAt = new Date();
                let done = false;
                let customId="";
                let currentUid=this.user.uid;
                console.log("uid1: "+currentUid);
                let cate=this.$route.params.category;
                db.collection('users').doc(currentUid).collection('todos').add({todo, createdAt, done}).then(function(docRef) {
                    console.log("Document written with ID: ", docRef.id);
                                    console.log("uid2: "+currentUid);

                    customId=docRef.id;
                }).then(()=>{
                    console.log("in then: ", customId);
                                    console.log("uid3: "+currentUid);

                    db.collection('users').doc(currentUid).collection('todosCat').doc(cate).collection(cate).doc(customId).set({todo, createdAt, done});
                });
                
            },
            deleteTodo(id) {
                db.collection('users').doc(this.user.uid).collection('todos').doc(id).delete();
            },
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