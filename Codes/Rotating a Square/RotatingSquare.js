
const FAILURE = -1;

var GL; // GL operations, context


var thetaLoc; // Address of the theta variable

var theta; // the angle

// Whenever the page is loaded, EXECUTE THIS FUNCTION
// run this initialize() function
window.onload = function initialize(){

    const canvas = document.querySelector("#glcanvas");
    GL = canvas.getContext("webgl");
    // GET WEBGL CONTEXT of this canvas

    if (GL == null) {
        alert("CANVAS NOT FOUND");
        return FAILURE;
    }

    // INITIALIZE SHADERS
    // Load shaders code
    // Compile shaders code
    // Create a new program
    // Put shaders into this new program
    // Link the program to GPU

    const vertexShaderID = "vertex-shader";
    const fragmentShaderID = "fragment-shader";
    var shadersProgram = initShaders(GL, vertexShaderID, fragmentShaderID);
    // program is created

    // USE THIS PROGRAM
    GL.useProgram(shadersProgram); // Everything is ready

    // Initial Coordinates of the Square
    var vertices = [
                vec2(0, 0.6),
                vec2(0.6, 0),
                vec2(-0.6, 0),
                vec2(0, -0.6)
    ];

    // PUT THOSE POINTS TO THE VERTEX BUFFER
    var bufferID = GL.createBuffer(); // Create Buffer on GPU
    GL.bindBuffer(GL.ARRAY_BUFFER, bufferID); // We will use this buffer, ENABLE THIS BUFFER
    // GL.ARRAY_BUFFER means STORING VERTEX INFORMATION
    GL.bufferData(GL.ARRAY_BUFFER, flatten(vertices), GL.STATIC_DRAW);
    // PUT THE POINTS TO THE BUFFER

    // flatten(vertices) = 2 Boyutlu arrayi düzlestir

    // DEFINE SHADER VARIABLES
    //  1. vPosition    (attribute)
    var vPosition = GL.getAttribLocation(shadersProgram, "vPosition");
    // Give me address of vPosition
    // GO TO THIS ADDRESS AND DEFINE
    GL.vertexAttribPointer(vPosition, 2, GL.FLOAT, false, 0 ,0);
    GL.enableVertexAttribArray(vPosition);// Enable this

    //  2. THETA        (uniform)
    thetaLoc = GL.getUniformLocation(shadersProgram, "theta");
    // This is a uniform type, it is different

    theta = 0; // initial value of the angle
    GL.uniform1f(thetaLoc, theta); // BASIC ASSINGMENT
    // Assign the value of theta to theta

    // Set background color
    GL.clearColor(1.0, 1.0, 1.0, 1.0); // Beyaz arkaplan

    var fps = 1000/60;
    setInterval(render , fps); // *****
    // Call render function in each 15 ms

};


function render(){
    // This will calculate new theta, and draw vertices

    GL.clear(GL.COLOR_BUFFER_BIT);

    // Calculate new theta
    theta += 0.01; // tetayı düzenli olarak artır bir miktar

    // ASSIGN NEW THETA, I.E. SEND NEW THETA TO THE SHADERS
    // Shaders will calculate each vertex
    GL.uniform1f(thetaLoc, theta);

    // DRAW THE COORDINATES IN THE BUFFER
    // Who changes the coordinates in the buffer? -> Vertex Shader
    GL.drawArrays(GL.TRIANGLE_STRIP, 0, 4);
    // Triangle Strip

}
