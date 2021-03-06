var expect = require('chai').expect,
    _ = require('underscore'),
    testRunner = require('rAppid.js').TestRunner.setup();

var C = {};


describe('text.operation.InsertTextOperation', function () {


    before(function (done) {
        testRunner.requireClasses({
            TextFlow: 'text/entity/TextFlow',
            Span: 'text/entity/SpanElement',
            Paragraph: 'text/entity/ParagraphElement',
            TextRange: 'text/entity/TextRange',
            DeleteOperation: 'text/operation/DeleteOperation',
            Style: 'text/type/Style'
        }, C, done);

    });

    describe('#doOperation()', function () {

        it('should not delete if range is not set', function () {
            var textFlow = new C.TextFlow(),
                paragraph = new C.Paragraph(),
                span1 = new C.Span({text: "This is text."}),
                textRange;

            paragraph.addChild(span1);
            textFlow.addChild(paragraph);

            textRange = new C.TextRange({
                anchorIndex: 0,
                activeIndex: 0
            });

            var operation = new C.DeleteOperation(textRange, textFlow);
            operation.doOperation();

            expect(textFlow.text()).to.be.equal("This is text.");
        });

        it('should delete range', function () {
            var textFlow = new C.TextFlow(),
                paragraph = new C.Paragraph(),
                span1 = new C.Span({text: "ABC"}),
                textRange;

            paragraph.addChild(span1);
            textFlow.addChild(paragraph);

            textRange = new C.TextRange({
                anchorIndex: 1,
                activeIndex: 2
            });

            var operation = new C.DeleteOperation(textRange, textFlow);
            operation.doOperation();

            expect(textFlow.numChildren()).to.be.equal(1);
            expect(textFlow.text()).to.be.equal("AC");
        });

        it('should delete range where anchor is higher than active index', function () {
            var textFlow = new C.TextFlow(),
                paragraph = new C.Paragraph(),
                span1 = new C.Span({text: "ABC"}),
                textRange;

            paragraph.addChild(span1);
            textFlow.addChild(paragraph);

            textRange = new C.TextRange({
                anchorIndex: 2,
                activeIndex: 1
            });

            var operation = new C.DeleteOperation(textRange, textFlow);
            operation.doOperation();

            expect(textFlow.text()).to.be.equal("AC");
        });

        it('should delete elements between start and end element', function () {
            var textFlow = new C.TextFlow(),
                paragraph = new C.Paragraph(),
                span1 = new C.Span({text: "ABC"}),
                span2 = new C.Span({text: "DEF"}),
                span3 = new C.Span({text: "GHI"}),
                textRange;

            paragraph.addChild(span1);
            paragraph.addChild(span2);
            paragraph.addChild(span3);
            textFlow.addChild(paragraph);

            textRange = new C.TextRange({
                anchorIndex: 1,
                activeIndex: 8
            });

            var operation = new C.DeleteOperation(textRange, textFlow);
            operation.doOperation();

            expect(textFlow.text()).to.be.equal("AI");
            expect(textFlow.numChildren()).to.be.equal(1);
        });

        it('should merge paragraphs', function () {
            var textFlow = new C.TextFlow(),
                paragraph = new C.Paragraph(),
                paragraph2 = new C.Paragraph(),
                span1 = new C.Span({text: "ABC"}),
                span2 = new C.Span({text: "DEF"}),
                textRange;

            paragraph.addChild(span1);
            paragraph2.addChild(span2);

            textFlow.addChild(paragraph);
            textFlow.addChild(paragraph2);

            textRange = new C.TextRange({
                anchorIndex: 2,
                activeIndex: 5
            });

            var operation = new C.DeleteOperation(textRange, textFlow);
            operation.doOperation();

            expect(textFlow.text()).to.be.equal("ABEF");
            expect(textFlow.numChildren()).to.be.equal(1);


        });

        it('should merge paragraphs', function () {
            var textFlow = new C.TextFlow(),
                paragraph = new C.Paragraph(),
                paragraph2 = new C.Paragraph(),
                span1 = new C.Span({text: "ABC"}),
                span2 = new C.Span({text: "DEF"}),
                span3 = new C.Span({text: "GHI"}),
                textRange;

            paragraph.addChild(span1);
            paragraph2.addChild(span2);
            paragraph2.addChild(span3);

            textFlow.addChild(paragraph);
            textFlow.addChild(paragraph2);

            textRange = new C.TextRange({
                anchorIndex: 3,
                activeIndex: 4
            });

            var operation = new C.DeleteOperation(textRange, textFlow);
            operation.doOperation();

            expect(textFlow.text()).to.be.equal("ABCDEFGHI");
            expect(textFlow.numChildren()).to.be.equal(1);


        });

        it('should delete empty spans and merge', function () {
            var textFlow = new C.TextFlow(),
                paragraph = new C.Paragraph(),
                span1 = new C.Span({text: "ABC"}),
                span2 = new C.Span({text: "DEF"}),
                span3 = new C.Span({text: "GHI"}),
                textRange;

            paragraph.addChild(span1);
            paragraph.addChild(span2);
            paragraph.addChild(span3);

            textFlow.addChild(paragraph);

            textRange = new C.TextRange({
                anchorIndex: 6,
                activeIndex: 9
            });

            var operation = new C.DeleteOperation(textRange, textFlow);
            operation.doOperation();

            expect(paragraph.text()).to.be.equal("ABCDEF");
            expect(paragraph.numChildren()).to.be.equal(1);

        });

        it('should delete empty spans and merge', function () {
            var textFlow = new C.TextFlow(),
                paragraph = new C.Paragraph(),
                span1 = new C.Span({text: "AB"}),
                span2 = new C.Span({text: "CD"}),
                span3 = new C.Span({text: "EF"}),
                textRange;

            paragraph.addChild(span1);
            paragraph.addChild(span2);
            paragraph.addChild(span3);

            textFlow.addChild(paragraph);

            textRange = new C.TextRange({
                anchorIndex: 3,
                activeIndex: 4
            });

            var operation = new C.DeleteOperation(textRange, textFlow);
            operation.doOperation();

            expect(paragraph.text()).to.be.equal("ABCEF");
            expect(paragraph.numChildren()).to.be.equal(1);

        });

        it('should delete last element of paragraph', function(){
            var textFlow = new C.TextFlow(),
                paragraph = new C.Paragraph(),
                paragraph2 = new C.Paragraph(),
                span1 = new C.Span({text: "AB"}),
                span2 = new C.Span({text: "CD"}),
                textRange;

            paragraph.addChild(span1);
            paragraph2.addChild(span2);

            textFlow.addChild(paragraph);
            textFlow.addChild(paragraph2);

            textRange = new C.TextRange({
                anchorIndex: 1,
                activeIndex: 2
            });

            var operation = new C.DeleteOperation(textRange, textFlow);
            operation.doOperation();

            expect(textFlow.text(0, -1, "¶")).to.be.equal("A¶CD¶");
            expect(textFlow.numChildren()).to.be.equal(2);

        });

        it('should preserve style of merged spans in paragraph', function () {
            var textFlow = new C.TextFlow(),
                paragraph = new C.Paragraph(),
                paragraph2 = new C.Paragraph(),
                span1 = new C.Span({text: "AB", style: new C.Style({fontStyle: "italic"})}),
                span2 = new C.Span({text: "CD", style: new C.Style({fontWeight: "bold"})}),
                textRange;

            paragraph.addChild(span1);
            paragraph2.addChild(span2);

            textFlow.addChild(paragraph);
            textFlow.addChild(paragraph2);

            textRange = new C.TextRange({
                anchorIndex: 2,
                activeIndex: 3
            });

            var operation = new C.DeleteOperation(textRange, textFlow);
            operation.doOperation();

            expect(paragraph.text()).to.be.equal("ABCD");
            expect(paragraph.getChildAt(0).composeStyle()).to.be.eql({fontStyle: "italic"});
            expect(paragraph.getChildAt(1).composeStyle()).to.be.eql({fontWeight: "bold"});
        });

        it('should delete first character of paragraph', function () {
            var textFlow = new C.TextFlow(),
                paragraph = new C.Paragraph(),
                paragraph2 = new C.Paragraph(),
                span1 = new C.Span({text: "AB"}),
                span2 = new C.Span({text: "CD"}),
                textRange;

            paragraph.addChild(span1);
            paragraph2.addChild(span2);

            textFlow.addChild(paragraph);
            textFlow.addChild(paragraph2);

            textRange = new C.TextRange({
                anchorIndex: 3,
                activeIndex: 4
            });

            var operation = new C.DeleteOperation(textRange, textFlow);
            operation.doOperation();

            expect(textFlow.text(0, -1, "¶")).to.be.equal("AB¶D¶");
        });

    });

});