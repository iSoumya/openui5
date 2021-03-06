/*global QUnit,sinon*/

sap.ui.require(['sap/ui/core/mvc/Controller', 'sap/ui/core/mvc/XMLView'],
	function (controller, xmlview) {
	"use strict";

	sap.ui.require(["sap/ui/thirdparty/jquery",
		"sap/ui/core/StashedControlSupport",
		"sap/uxap/ObjectPageLazyLoader"
	], function (jQuery, StashedSupport, ObjectPageLazyLoader) {

		sap.ui.loader.config({
			paths: {
			   "sap/uxap/testblocks": "./blocks",
			   "view": "./view"
			 }
		  });

		controller.create({ name: "viewController" });

		QUnit.module("Stashing Tests", {
			beforeEach: function (assert) {
				var done = assert.async();
				xmlview.create({
					id: "UxAP-12-ObjectPageSubSectionStashing",
					viewName: "view.UxAP-12-ObjectPageSubSectionStashing"
				}).then(function (oView) {
					this.objectPageSampleView = oView;
					this.objectPageSampleView.placeAt('qunit-fixture');
					sap.ui.getCore().applyChanges();
					done();
				}.bind(this));
			},
			afterEach: function () {
				this.objectPageSampleView.destroy();
			}
		});

		QUnit.test("ObjectPageSubSection stashing", function (assert) {
			var oTestedSection = this.objectPageSampleView.byId("subsection10"),
				oLazyLoaderSpy = sinon.spy(ObjectPageLazyLoader.prototype, "destroy"),
				oLazyLoaderRemoveAllContentSpy = sinon.spy(ObjectPageLazyLoader.prototype, "removeAllContent"),
				aStashedControls = StashedSupport.getStashedControls(oTestedSection.getId()),
				stashedObjects = 3;

			assert.ok(oTestedSection.getBlocks(), "There are no blocks in the section");
			assert.equal(aStashedControls.length, stashedObjects, "Blocks are stashed");

			oTestedSection.connectToModels();

			assert.equal(oTestedSection.getBlocks().length, stashedObjects, "Blocks successfully unstashed");
			assert.equal(StashedSupport.getStashedControls(oTestedSection.getId()).length, 0, "There are no blocks left to unstash");

			oTestedSection.getBlocks().forEach(function (oContent) {
				assert.ok(oContent instanceof sap.m.Toolbar, "The correct content is inside the blocks aggregation");
			});

			assert.equal(oLazyLoaderRemoveAllContentSpy.callCount, stashedObjects,
				"Remove all content from the LazyLoader so it can be properly destroyed.");

			assert.equal(oLazyLoaderSpy.callCount, stashedObjects, "LazyLoaders are properly disposed of");
		});
	});

});
