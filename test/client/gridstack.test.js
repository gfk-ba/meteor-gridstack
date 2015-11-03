const GRIDSTACK_TEMPLATE_NAME = 'gridstack';
const GRIDSTACK_WIDGET_TEMPLATE_NAME = 'gridstack_widget';

describe('Templates', function() {
  let gridstackTemplateInstance;
  let fakeDomNode;
  let fakeGridstack;
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();

    gridstackTemplateInstance = TemplateTestHelpers.getMockTemplateInstance();
    fakeGridstack = sinon.createStubInstance(GridStackUI);
    sandbox.stub(Template, 'instance').returns(gridstackTemplateInstance);

    gridstackTemplateInstance.data = {
      options: {}
    };

    fakeDomNode = {};

    var constructorOptions;

    sandbox.stub($.fn, 'gridstack', function(options) {
      constructorOptions = options;
      return this;
    });

    sandbox.stub($.fn, 'get').returns(fakeDomNode);
    sandbox.stub($.fn, 'data').returns(fakeGridstack);
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('gridstack', function() {
    describe('When rendered', function() {
      beforeEach(function() {
        TemplateTestHelpers.getTemplateOnRenderedFunction(GRIDSTACK_TEMPLATE_NAME).call(gridstackTemplateInstance);
        sandbox.stub(Blaze, 'getData').returns({});
      });

      describe('Helpers', function() {
        describe('#getGridstack', function() {
          it('Should return the gridstackInstance saved on the template instance', function() {
            let getGridstack = TemplateTestHelpers.getTemplateHelper(GRIDSTACK_TEMPLATE_NAME, 'getGridstack');

            expect(getGridstack()).to.equal(gridstackTemplateInstance.gridstack);
          });
        });
      });

      describe('onRendered', function() {
        it('Should setup a gridstack instance', function() {
          expect($.fn.gridstack).to.have.been.calledOnce;
          expect(gridstackTemplateInstance.gridstack).to.equal(fakeGridstack);
        });

        it('Should setup uihooks for dom manipulations', function() {
          expect(fakeDomNode._uihooks).to.be.a('object');
        });

        describe('UI Hooks', function() {
          let hooks;

          beforeEach(function() {
            hooks = fakeDomNode._uihooks;
          });

          describe('#insertElement', function() {
            it('Should call the add_widget method of the gridstack instance ', function() {
              let blazeData = {
                x: 1,
                y: 2,
                width: 10,
                height: 12,
                auto_position: false
              };

              let fakeNode = {
                'foo': 'bar'
              };

              Blaze.getData.returns(blazeData);

              hooks.insertElement(fakeNode);

              expect(gridstackTemplateInstance.gridstack.add_widget).to.have.been.calledWith(
                fakeNode,
                blazeData.x,
                blazeData.y,
                blazeData.width,
                blazeData.height,
                blazeData.auto_position);
            });
          });

          describe('#removeElement', function() {
            it('Should call the remove_widget method of the gridstack instance ', function() {
              let node = {
                x: 1,
                y: 2,
                width: 10,
                height: 12
              };
              hooks.removeElement(node);

              expect(gridstackTemplateInstance.gridstack.remove_widget).to.have.been.calledWith(node);
            });
          });
        });
      });
    });
  });

  describe('gridstack_widget', function() {
    let widgetTemplateInstance;

    beforeEach(function() {
      widgetTemplateInstance = TemplateTestHelpers.getMockTemplateInstance();
      widgetTemplateInstance.view = {
        isRendered: false
      };

      Template.instance.returns(widgetTemplateInstance);
      sandbox.stub(Template, 'parentData').returns({
        gridstack: fakeGridstack,
        editing: false,
        options: {}
      });
    });

    describe('#isLocked', function() {
      let isLocked;
      beforeEach(function() {
        isLocked = TemplateTestHelpers.getTemplateHelper(GRIDSTACK_WIDGET_TEMPLATE_NAME, 'isLocked');
      });

      it('Should return the value of this.locked', function() {
        expect(isLocked.apply({ locked: true })).to.equal(true);
        expect(isLocked.apply({ locked: false })).to.equal(false);
        expect(isLocked()).to.equal(false);
      });

      describe('When template is rendered', function() {
        let dummyNode;

        beforeEach(function() {
          dummyNode = {};
          widgetTemplateInstance.view.isRendered = true;
          widgetTemplateInstance.$ = sandbox.stub();
          widgetTemplateInstance.$.returns(dummyNode);
        });

        it('Should pass call the locked method of gridstack', function() {
          isLocked.apply({ locked: true });
          expect(fakeGridstack.locked).to.have.been.calledWith(dummyNode, true);
        });
      });
    });

    describe('#getBlockLayoutTemplate', function() {
      let getBlockLayoutTemplate;
      beforeEach(function() {
        getBlockLayoutTemplate = TemplateTestHelpers.getTemplateHelper(GRIDSTACK_WIDGET_TEMPLATE_NAME, 'getBlockLayoutTemplate');
      });

      it('Should return the default widgetLayout', function() {
        expect(getBlockLayoutTemplate()).to.equal('gridstack_default_widgetLayout');
      });

      describe('When widgetLayoutTemplate was defined in options', function() {
        it('Should return options.widgetLayouTemplate', function() {
          let someTemplate = 'blablabla';

          Template.parentData.returns({
            options: {
              widgetLayoutTemplate: someTemplate
            }
          });
          expect(getBlockLayoutTemplate()).to.equal(someTemplate);
        });
      });
    });

    function isNotName (name, gridstackFnName) {
      describe('#' + name, function() {
        let isNotHelper;
        beforeEach(function() {
          isNotHelper = TemplateTestHelpers.getTemplateHelper(GRIDSTACK_WIDGET_TEMPLATE_NAME, name);
        });

        it('Should return the appropiate value', function() {
          expect(isNotHelper.apply({ locked: true })).to.equal(true);
          expect(isNotHelper.apply({ locked: false })).to.equal(true);
          Template.parentData.returns({
            gridstack: fakeGridstack,
            editing: true
          });

          expect(isNotHelper.apply({ locked: true })).to.equal(true);
          expect(isNotHelper.apply({ locked: false })).to.equal(false);
        });

        describe('When template is rendered', function() {
          let dummyNode;

          beforeEach(function() {
            TemplateTestHelpers.getTemplateOnRenderedFunction(GRIDSTACK_TEMPLATE_NAME).call(gridstackTemplateInstance);

            dummyNode = {};
            widgetTemplateInstance.view.isRendered = true;
            widgetTemplateInstance.$ = sandbox.stub();
            widgetTemplateInstance.$.returns(dummyNode);
          });

          it('Should call the ' + gridstackFnName + ' method of gridstack', function() {
            Template.parentData.returns({
              gridstack: fakeGridstack,
              editing: true
            });

            isNotHelper.apply({ locked: false });
            expect(gridstackTemplateInstance.gridstack[gridstackFnName]).to.have.been.calledWith(dummyNode, true);
          });
        });
      });
    }

    isNotName('isNotMovable', 'movable');
    isNotName('isNotResizable', 'resizable');

    des
  });
});


