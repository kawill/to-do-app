;
(function(exports) {
    "use strict";

    Backbone.TodoRouter = Backbone.Router.extend({

        initialize: function() {
            console.log("initialized");
            this.collection = new Backbone.TodoActualList();
            this.view1 = new Backbone.TodoView({
                collection: this.collection
            });
            this.view2 = new Backbone.TodoViewDetail({});
            Backbone.history.start();
        },
        routes: {
            "*default": "home",
            "details/:item": "showDetail"
        },
        home: function() {
            this.view1.render();
            // this.view2.render(); //Temporary: we'll move the detail view later
        },
        showDetail: function(item) {
            // this.view2.render();
            console.log(item);
        }
    })

    Backbone.TodoModel = Backbone.Model.extend({
        defaults: {
            "checked": "false",
            "title": "No title given.",
            "done": "false"
        },
        validate: function(data) {
            // debugger;
            var x = data.title.length > 0;

            // debugger;
            if (!x) {
                return "Title Required.";
            }
        }
    })

    Backbone.TodoActualList = Backbone.Collection.extend({
        model: Backbone.TodoModel
    })

    Backbone.TodoView = Backbone.TemplateView.extend({
        el: ".container1",
        view: "todoList",
        events: {
            "submit .addItemForm": "addItem",
            "click .data": "showDetail"
        },
        addItem: function(event) {
            event.preventDefault();
            var x = {
                title: this.el.querySelector("input[name = 'John']").value
            }
            this.collection.add(x, {
                validate: true
            });
            console.log("Yay!");
            // debugger;
        },
        checked: function() {

        },
        showDetail: function(event) {
            event.preventDefault();
            // find model
            var li = event.target.parentElement;
            var cid = li.getAttribute('cid');
            var model = this.collection.get(cid);
            Backbone.trigger("newModelForDetailView", model);
        }
    })

    Backbone.TodoViewDetail = Backbone.TemplateView.extend({
        el: ".container2",
        view: "todoDetails",
        initialize: function(options) {
            this.options = options;
            this.listenTo(Backbone, "newModelForDetailView", this.setModel)
            this.model && this.model.on("change", this.render.bind(this));
            this.collection && this.collection.on("add reset remove", this.render.bind(this));
        },
        setModel: function(model) {
            if (this.model === model) {
                this.model = null;
                this.el.innerHTML = "";
            } else {
                this.model = model;
                this.render();
            }
        }
    })

})(typeof module === "object" ? module.exports : window)
