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
            <Todo :userId="user.uid" :todo="item" style="white-space: nowrap; overflow: hidden"/>
                </router-link>
        </div>
        <br/>
        <router-link class="toggle" v-if="!done" to="/done">Show Finished Items</router-link>
        <router-link class="toggle" v-else to="/todos">Show Unfinished Items</router-link>
        <h1>Active categories</h1>
        <form v-on:submit.prevent="addCategory(categ)">
            <input v-model="categ" placeholder="Add new category">
            <button type="submit">Add new category</button>
        </form>
        <div v-for="(item) in categories" :key="item.id">
            <router-link :to="{ name: 'TodosCat', params: { category: item.category }}">
                <h3>{{item.category}}</h3>
                <button  @click="deleteCategory(item.category)">Delete category</button>
            </router-link>
        </div>
    </div>
</template>

<script>
    import { auth, db } from "../firebaseConfig"
    import Todo from '../views/Todo.vue'
    import firebase from 'firebase/app'

    export default {
        name: "Todos",
        components: {Todo},
        data: function() {
            return {
                user: "",
                todos: [],
                todo: "",
                categories: [], 
                categ: ""
            }
        },
        props: {
            done: {
                type: Boolean,
                default: false
            },
            userId: String
        },
        computed: {
            filteredTodos: function() {
                return this.todos.filter(i => i.done === this.done);
            }
        },
        
        beforeCreate: function() {
            auth.onAuthStateChanged(user => {
                this.user = user;
                if (!user) {
                    this.$router.push("/")
                }else{
                    this.user=user;
                }
            })
        },
        firestore: function(){
            let currUid = firebase.auth().currentUser.uid;
                return{
                    todos: db.collection('users').doc(currUid).collection('todos').orderBy('createdAt', 'desc'),
                    categories: db.collection('users').doc(currUid).collection('categories')
                }
        },
        methods: {
            addTodo(todo) {
                let createdAt = new Date();
                let done = false;
                let category="";
                db.collection('users').doc(this.user.uid).collection('todos').add({todo, createdAt, done, category});
            }, 
            deleteCategory(category){
                db.collection('users').doc(this.user.uid).collection('categories').doc(category).delete();
                let currCategoryItems = db.collection('users').doc(this.user.uid).collection('todos').where('category','==', category);
                currCategoryItems.get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        doc.ref.update({category: ""});
                    });
                }).then(()=>{
                    window.location.href = 'https://csci5117hw2.web.app/todos/';
                });
            }, 
            addCategory(categ) {
                db.collection('users').doc(this.user.uid).collection('categories').doc(categ).set({done: true, category: categ}, {merge: true});
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