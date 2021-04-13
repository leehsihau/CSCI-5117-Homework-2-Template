<template>
  <div class="todo">
    <div v-if="!todo">
        <div class="NotFound">
        <h1>That page was not found</h1>
        <router-link to="/todos">Go Home</router-link>
    </div>
    </div>

    <div v-else>
    <div v-if="todo" class="box">
      {{ todo.todo }}
    </div>
    <button v-if="!todo.done" @click.prevent="markAsDone(todo.id)">
      Done!
    </button>
    <router-link class="return" v-if="this.$route.params.id" to="/todos"
      >Back to To-do list</router-link>
    <br />
    <br />
    <form v-if="this.$route.params.id" v-on:submit.prevent="updateTodo(todo)">
      <input v-model="todo.todo" />
      <button type="submit">Update To-do</button>
    </form>
    <br />
    <form v-if="this.$route.params.id" v-on:submit.prevent="addToCategory(todo, category)">
      <input v-model="category" />
      <button type="submit">Update category</button>
    </form>
  </div>
  </div>
</template>

<script>
import { auth, db } from "@/firebaseConfig";
export default {
  name: "Todo",
  data() {
    return {
      user: "",
    };
  },
  props: {
    todo: Object,
    userId: String,
    category: String,
  },
  beforeCreate: function () {
    // console.log('In before created');

    if (this.$route.params.id) {
      auth.onAuthStateChanged((user) => {
        this.user = user;
        if (!user) {
          this.$router.push("/");
        } else {
          console.log("rnm beforeCreate: " + this.user);
          this.$bind(
            "todo",
            db
              .collection("users")
              .doc(this.user.uid)
              .collection("todos")
              .doc(this.$route.params.id)
          );
        }
      });
    }
  },

  methods: {
    markAsDone(id) {
      let done = true;
      let placeholder = undefined;
      if (this.userId == undefined) {
        placeholder = this.user.uid;
      } else {
        placeholder = this.userId;
      }
      //let idInOrg = "";
      console.log("indicator: " + id);
      //let category = this.category;
      db.collection("users").doc(placeholder).collection("todos").doc(id).update({done});
    },
    updateTodo(todo) {
      let placeholder = undefined;
      if (this.userId == undefined) {
        placeholder = this.user.uid;
      } else {
        placeholder = this.userId;
      }
      console.log("indicator: " + todo.id);
      db.collection("users")
              .doc(placeholder)
              .collection("todos")
              .doc(todo.id)
              .update(todo);

    },
    addToCategory(todo, category) {
      let placeholder = undefined;
      if (this.userId == undefined) {
        placeholder = this.user.uid;
      } else {
        placeholder = this.userId;
      }
      db.collection("users")
              .doc(placeholder)
              .collection("todos")
              .doc(todo.id).update({category: category});
      db.collection("users").doc(placeholder).collection("categories").doc(category).set({done: true, category: category}, {merge: true});

    }
  },
  created() {
    //  console.log('In created');
    //   console.log("todo: "+this.todo);
    if (this.todo == null) {
      console.log("shi null");
    }
  },
  beforeMount() {
    // console.log('In beforemount');
    //console.log("todo: "+this.todo);
  },
  mounted() {
    console.log('In mounted: ');
    console.log(this.todo);
    console.log(this);
  },
};
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