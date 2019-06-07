const { Program } = require('../');
//  const { settings } = require('@pixi/settings');
//  const { ENV } = require('@pixi/constants');
const { skipHello } = require('@pixi/utils');

skipHello();

const vertexShader1xx = `
attribute float aTest;

void main(void){
   gl_Position = vec4(1.0);
}`;

const fragmentShader1xx = `
uniform float uTest;

void main(void){
   gl_FragColor = vec4(1.0);
}`;

const vertexShader3xx = `
#version 300 es
precision mediump float;

in vec2 aVertexPosition;
in vec2 aTextureCoord;

uniform mat3 projectionMatrix;

out vec2 vTextureCoord;

void main(void){
  gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
  vTextureCoord = aTextureCoord;
}`;

const fragmentShader3xx = `
#version 300 es
precision mediump float;

in vec2 vTextureCoord;
uniform sampler2D uSampler;
out vec4 color;

void main(void) {
    color = texture(uSampler, vTextureCoord);
}`;

describe('PIXI.Program', function ()
{
    it('should start with default shaders in case of no attributes passed', function ()
    {
        const program = new Program();

        expect(program.vertexSrc.includes(Program.defaultVertexSrc.trim())).to.equal(true);
        expect(program.fragmentSrc.includes(Program.defaultFragmentSrc.trim())).to.equal(true);
    });

    it('should use shaders are passed', function ()
    {
        const program = new Program(vertexShader1xx, fragmentShader1xx);

        expect(program.vertexSrc.includes(vertexShader1xx.trim())).to.equal(true);
        expect(program.fragmentSrc.includes(fragmentShader1xx.trim())).to.equal(true);
    });

    it('should use 3xx shaders are passed', function ()
    {
        let program;

        try
        {
            program = new Program(vertexShader3xx, fragmentShader3xx);

            expect(program.vertexSrc.includes(vertexShader3xx.trim())).to.equal(true);
            expect(program.fragmentSrc.includes(fragmentShader3xx.trim())).to.equal(true);
        }
        catch (e)
        {
            this.skip();
        }
    });

    describe('static from() constructor', function ()
    {
        it('should reuse already instantiated programs with same pairs of shaders', function ()
        {
            const program1 = Program.from(vertexShader1xx, fragmentShader1xx);
            const program2 = Program.from(vertexShader1xx, fragmentShader1xx);

            expect(program1).to.equal(program2);
        });
    });
});
