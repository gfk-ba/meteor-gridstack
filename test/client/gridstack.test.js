const GRIDSTACK_TEMPLATE_NAME = 'gridstack';

describe('Templates', function() {
  let templateInstance;
  let fakeDomNode;
  let fakeGridstack;
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();

    templateInstance = TemplateTestHelpers.getMockTemplateInstance();
    fakeGridstack = sinon.createStubInstance(GridStackUI);
    sandbox.stub(Template, 'instance').returns(templateInstance);

    templateInstance.data = {
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
        TemplateTestHelpers.getTemplateOnRenderedFunction(GRIDSTACK_TEMPLATE_NAME).call(templateInstance);
        sandbox.stub(Blaze, 'getData').returns({});
      });

      describe('Helpers', function() {
        describe('#getGridstack', function() {
          it('Should return the gridstackInstance saved on the template instance', function() {
            let getGridstack = TemplateTestHelpers.getTemplateHelper(GRIDSTACK_TEMPLATE_NAME, 'getGridstack');

            expect(getGridstack()).to.equal(templateInstance.gridstack);
          });
        });
      });

      describe('onRendered', function() {
        it('Should setup a gridstack instance', function() {
          expect($.fn.gridstack).to.have.been.calledOnce;
          expect(templateInstance.gridstack).to.equal(fakeGridstack);
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

              expect(templateInstance.gridstack.add_widget).to.have.been.calledWith(
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

              expect(templateInstance.gridstack.remove_widget).to.have.been.calledWith(node);
            });
          });
        });
      });
    });
  });

  describe('gridstack_widget', function() {

  });
});


