Template.gridstack.onRendered(function() {
  let $gridstackDiv = this.$('.grid-stack').gridstack({
    float: true
  });

  let options = this.data.options || {};

  this.gridstack = $gridstackDiv.data('gridstack');

  if (_.isFunction(options.changeHandler)) {
    $gridstackDiv.on('change', options.changeHandler);
  }

  $gridstackDiv.get(0)._uihooks =  {
    insertElement: (node) => {
      let data = Blaze.getData(node);

      this.gridstack.add_widget(node,
        data.x, data.y, data.width, data.height, data.auto_position);
    },
    moveElement: () => {
      /**
       * Move element is not necessary because gridstack keeps the dom nodes in the same position of the dom
       */
    },
    removeElement: (node) => {
      this.gridstack.remove_widget(node);
    }
  };
});

Template.gridstack.helpers({
  getGridstack: function() {
    return Template.instance().gridstack;
  }
});

Template.gridstack_widget.helpers({
  isLocked: function() {
    let templateInstance = Template.instance();
    let parentData = Template.parentData();

    if (templateInstance.view.isRendered) {
      let node = templateInstance.$('.grid-stack-item');
      parentData.gridstack.locked(node, this.locked);
    }

    return !!this.locked;
  },
  isNotMovable: function() {
    let parentData = Template.parentData();
    let isMovable = parentData.editing && !this.locked;
    let templateInstance = Template.instance();

    if (templateInstance.view.isRendered) {
      let node = templateInstance.$('.grid-stack-item');
      parentData.gridstack.movable(node, isMovable);
    }

    return !isMovable;
  },
  isNotResizable: function() {
    let parentData = Template.parentData();
    let isResizable = parentData.editing && !this.locked;
    let templateInstance = Template.instance();

    if (templateInstance.view.isRendered) {
      let node = templateInstance.$('.grid-stack-item');
      parentData.gridstack.resizable(node, isResizable);
    }

    return !isResizable;
  },
  getBlockLayoutTemplate: function() {
    let options = Template.parentData().options || {};

    if (!options || !options.widgetLayoutTemplate) {
      return 'gridstack_default_widgetLayout';
    }

    return options.widgetLayoutTemplate;
  }
});
