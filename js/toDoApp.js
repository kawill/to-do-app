;(function(exports) {
    "use strict";
    // dummy data
    var data = [{
        title: "load dishwasher"
    }, {
        title: "take out the trash"
    }, {
        title: "fold sheets"
    }, {
        title: "go to the grocery store"
    }];

    Backbone.TodoRouter = Backbone.Router.extend({

        initialize: function() {
            console.log("initialized");
            this.collection = new Backbone.TodoActualList(data);
            this.view = new Backbone.TodoView ({
                collection: this.collection
            });
            Backbone.history.start();
        },
        routes: {
            "*default": "home"
        },
        home: function() {
            this.view.render();
        }
    });

    Backbone.TodoModel = Backbone.Model.extend({
        defaults: {
            checked: false,
            title: "No title given.",
            taskdone: false,
            urgent: false

        },
        validate: function(data) {
            // debugger;
            var x = data.title.length > 0;

            // debugger;
            if (!x) {
                return "Title Required.";
            }
        }
    });

    Backbone.TodoActualList = Backbone.Collection.extend({
        model: Backbone.TodoModel
        // ,comparator for ordering
    });

    Backbone.TodoView = Backbone.TemplateView.extend({
        el: ".container",
        view: "todoList",
        events: {
            "submit .addItemForm": "addItem",
            "change input[name='taskdone']": "showAsDone",
            "change input[name='urgent']": "showAsUrgent"
        },
        addItem: function(event) {
            event.preventDefault();
            var x = {
                title: this.el.querySelector("input[name = 'John']").value
            };
            this.collection.add(x, {
                validate: true
            });
            console.log("Yay!");
            // debugger;
        },
        selectModelForEvent: function(event) {
            var li = event.target.parentElement,
                cid = li.getAttribute('cid'),
                model = this.collection.get(cid);
            return model;
        },
        // selectModelForEvent: function(event) {
        //     var el = event.target;
        //         li = $(el).closest('li').get(0);
        //         cid = li.getAttribute('cid');
        //         model = this.collection.get(cid);
        //     return model;
        // },
        showAsDone: function(event) {
            // select item
            // event.preventDefault();
            var model = this.selectModelForEvent(event);
            if(model){
                model.set('taskdone', !model.get('taskdone'));
                if(model.get('taskdone')) {model.set('urgent', false);}
                this.collection.sort();
                this.render();
            }
        },
        showAsUrgent: function(event) {
            var model = this.selectModelForEvent(event);
            if(model){
                model.set('urgent', !model.get('urgent'));
                // if(model.get('urgent')) {model.set('taskdone', false);}
                this.collection.sort();
                this.render();
            }
        }
    });
})(typeof module === "object" ? module.exports : window)
