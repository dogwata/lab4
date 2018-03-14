'use strict';

var app = new Vue({
  el: '#app',
  data: {
    items: [],
    text: '',
    priority: 'normal',
    show: 'all',
    byPriority: false,
    drag: {},
  },
  created: function () {
    this.getItems();
  },
  computed: {
    activeItems: function () {
      return this.items.filter(function (item) {
        return !item.completed;
      });
    },
    filteredItems: function () {
      let filtered = this.items;
      if (this.byPriority) {
        let high = this.items.filter(function (item) {
          return item.priority === 'high';
        });
        let norm = this.items.filter(function (item) {
          return item.priority === 'normal';
        });
        let low = this.items.filter(function (item) {
          return item.priority === 'low';
        });
        filtered = high.concat(norm.concat(low));
      }
      if (this.show === 'active')
        return filtered.filter(function (item) {
          return !item.completed;
        });
      if (this.show === 'completed')
        return filtered.filter(function (item) {
          return item.completed;
        });
      return filtered;
    },
  },
  methods: {
    getItems: function () {
      axios.get("/api/items").then(response => {
        this.items = response.data;
        return true;
      }).catch(err => {
      });
    },
    addItem: function () {
      axios.post("/api/items", {
        text: this.text,
        completed: false,
        priority: this.priority
      }).then(response => {
        this.text = "";
        this.priority = 'normal';
        this.getItems();
        return true;
      }).catch(err => {
      });
    },
    completeItem: function (item) {
      axios.put("/api/items/" + item.id, {
        text: item.text,
        completed: !item.completed,
        priority: item.priority
      }).then(response => {
        return true;
      }).catch(err => {
      });
    },
    deleteItem: function (item) {
      axios.delete("/api/items/" + item.id).then(response => {
        this.getItems();
        return true;
      }).catch(err => {
      });
    },
    showAll: function () {
      this.show = 'all';
    },
    showActive: function () {
      this.show = 'active';
    },
    showCompleted: function () {
      this.show = 'completed';
    },
    deleteCompleted: function () {
      this.items.forEach(item => {
        if (item.completed)
          this.deleteItem(item)
      });
    },
    dragItem: function (item) {
      this.drag = item;
    },
    dropItem: function (item) {
      axios.put("/api/items/" + this.drag.id, {
        text: this.drag.text,
        completed: this.drag.completed,
        priority: this.drag.priority,
        orderChange: true,
        orderTarget: item.id
      }).then(response => {
        this.getItems();
        return true;
      }).catch(err => {
      });
    },
  }
});
/*    incrementPriority: function() {
      if (this.priority == "Low") {
        this.priority = "Med";
      } else if (this.priority == "Med") {
        this.priority = "High";
      } else {
        this.priority = "Low"
      }
    },
    incrementItemPriority: function(item) {
      if (item.priority == "Low") {
        item.priority = "Med";
      } else if (item.priority == "Med") {
        item.priority = "High";
      } else {
        item.priority = "Low"
      }
      axios.put(this.url + "/api/items/" + item.id, {
        text: item.text,
        completed: item.completed,
        priority: item.priority,
        orderChange: false,
      }).then(response => {
         return true;
      }).catch(err => {
      });
    },*/
