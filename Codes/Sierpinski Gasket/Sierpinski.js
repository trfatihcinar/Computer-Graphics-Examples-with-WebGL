
const FAILURE = -1;

var GL; // GL operations

const NUMBER_OF_POINTS = 3000; // we want 3 000 points to be rendered 
//to make the triangle 

// Whenever the page is loaded, EXECUTE THIS FUNCTION
// run this initialize() function
window.onload = function initialize(){

    const canvas = document.querySelector("#canvas");
    GL = canvas.getContext("webgl"); 
    // GET WEBGL CONTEXT of this canvas

    if (GL == null){
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

    // coordinates of the vertices of the triangle, big triangle
    var vertices = [vec2(-1,-1), 
                    vec2(0,1), 
                    vec2(1,-1)];
    
    var middlePointOne = scale(0.5 , add(vertices[0], vertices[1]));
    var middlePointTwo = scale(0.5 , add(vertices[0], vertices[2]));
    var middleOfMiddlePoints = scale(0.5, add(middlePointOne, middlePointTwo));
    // we got a point in the middle of the triangle
    // we chose NOT TO GET THE FIRST POINT RANDOMLY

    var points; // WE WILL STORE ALL THE POINT TO BE RENDERED HERE
    points =  [middleOfMiddlePoints]; // this is my first point

    var counter; // iteration number
    var randomVertex;
    var temporaryMiddlePoint; // middle points of random point and randomly chosen vertex
    for(counter = 1; counter < NUMBER_OF_POINTS; counter++){

        // GET A RANDOM VERTEX 
        // TR: rastgele bir köşe seçmen gerekiyor, 0, 1, 2
        randomVertex = Math.floor(Math.random() * 3);

        temporaryMiddlePoint = scale(0.5, add(points[counter-1], vertices[randomVertex]));
        points.push(temporaryMiddlePoint);
    }


    // OpenGL is a STATE MACHINE
    // Vertex Shader and Fragment Shader is directly connect to 
    // VERTEX BUFFER

    // PUT THOSE POINTS to VERTEX BUFFER
    var bufferID = GL.createBuffer(); // GPU üzerinde BELLEK YARATTIM, BUFFER YARATTIM
    GL.bindBuffer(GL.ARRAY_BUFFER , bufferID); // I WILL USE THIS BUFFER, ENABLE THIS BUFFER
    // GL.ARRAY_BUFFER means STORING VERTEX INFORMATION
    GL.bufferData(GL.ARRAY_BUFFER, flatten(points), GL.STATIC_DRAW);
    // PUT THE POINTS TO THE BUFFER

    // flatten(points) = points 2d arrayini düzleştir.

    // Define Shader Variable in THE BUFFER

    var vPosition = GL.getAttribLocation(shadersProgram, "vPosition");
    GL.vertexAttribPointer(vPosition, 2, GL.FLOAT, false, 0, 0);
    GL.enableVertexAttribArray(vPosition);
    // I HAVE DEFINED THIS, ENABLE THIS

    // SET BACKGROUND COLOR

    GL.clearColor(0.0, 0.0, 0.0, 1.0); // BLACK COLOR


    render(); // RENDER THE POINTS

};


function render(){
    

    GL.clear(GL.COLOR_BUFFER_BIT);  // RENDER BACKGROUND COLOR FIRST

    GL.drawArrays(GL.POINTS, 0, NUMBER_OF_POINTS);

    // GL.POINTS = nokta olarak çiz
}
