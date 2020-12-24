
// Canvas'a erişmemiz ve onun WEBGL özelliklerine erişmemiz gerekiyor.
const canvas = document.querySelector("#glcanvas");
// git canvas'ı bul ve ben ona erişeceğim
const GL = canvas.getContext("webgl"); // bu canvasa artık erişebilirim!
// bu kanvas üzerindeki WEBGL çizim araçlarına artık GL ile erişebilirim.
// canvas ve GL birbiri ile bağlantılı

const FAILURE = -1;

var theProgram; // THE SHADERS PROGRAM


function initializeShaders(){

    // Arabayı çalıştırır gibi
    // Vertex-shader'ı çalıştır, INITIALIZE THE VERTEX SHADER

    var vertexShader; // BOŞ VERTEX SHADER OBJEM
    var vertexElement = document.getElementById("vertex-shader");
    // HTML'e git, idsi vertex-shader olan scripte yani koda eriş
    // eğer bu koda erişemezsem BİTİR
    if (vertexElement == null) {
        alert("Unable to load THE VERTEX SHADER");
        return FAILURE;
    }
    else {
        // SUCCESS TO LOAD VERTEX SHADER

        vertexShader = GL.createShader(GL.VERTEX_SHADER);
        // Vertex shader temasından bir obje yarat.
        GL.shaderSource(vertexShader, vertexElement.text);
        // HTML'den kodu oku ve bu shaderın içine at
        GL.compileShader(vertexShader);
        // Kodu DERLE,  COMPILE VERTEX SHADER CODE
        // !! Derleme hatası olmuş olabilir.
        if (GL.getShaderParameter(vertexShader, GL.COMPILE_STATUS) == false) {
            alert("VERTEX SHADER FAILED TO COMPILE!");
            return FAILURE;
        }
    }

    // HERE: BURADA: Vertex shader loaded, compiled.

    // Arabayı çalıştırır gibi
    // Fragment-shader'ı çalıştır, INITIALIZE THE FRAGMENT SHADER

    var fragmentShader; // BOŞ FRAGMENT SHADER OBJESİ YARAT
    var fragmentElement = document.getElementById("fragment-shader");
    // HTML'e git, idsi fragment-shader olan scripte yani koda eriş
    // eğer bu koda erişemezsem BİTİR
    if (fragmentElement == null) {
        alert("Unable to load THE FRAGMENT SHADER");
        return FAILURE;
    }
    else {
        // SUCCESS TO LOAD FRAGMENT SHADER

        fragmentShader = GL.createShader(GL.FRAGMENT_SHADER);
        // Fragment shader temasından bir obje yarat.
        GL.shaderSource(fragmentShader, fragmentElement.text);
        // HTML'den kodu oku ve bu shaderın içine at
        GL.compileShader(fragmentShader);
        // Kodu DERLE,  COMPILE FRAGMENT SHADER CODE
        // !! Derleme hatası olmuş olabilir.
        if (GL.getShaderParameter(fragmentShader, GL.COMPILE_STATUS) == false) {
            alert("FRAGMENT SHADER FAILED TO COMPILE!");
            return FAILURE;
        }
    }

    // HERE: BURADA: Fragment shader loaded, compiled.
    
    // Buraya geldiğim zaman shaderlar derlendi.
    // AMA BİRLEŞTİRİLMEDİ! VE PROGRAM HALİNE GETİRİLMEDİ.

    // yeni bir kod yaratıyorum, program adında
    theProgram = GL.createProgram(); // boş bir program yarat.
    // programa VERTEX SHADER'I ve FRAGMENT SHADER'I yükle. CD'ye yükler gibi.
    GL.attachShader(theProgram, vertexShader);
    GL.attachShader(theProgram, fragmentShader); // shaderları programın içine yükle.
    // !! Shaderlar programın içerisinde, SHADERLAR İLE CANVAS BAĞLI DEĞİL
    // !! CONNECT SHADERS AND THE CANVAS.
    GL.linkProgram(theProgram);
    // GPU'ya bağla programı. 
    // Programı GPU'nun kullanabileceği hale getir.
    // Program <-> GPU

    // There might be ERRORS AND FAILURES in LINKING THE PROGRAM (TO THE GPU)

    if (GL.getProgramParameter(theProgram , GL.LINK_STATUS) == false){
        // THERE IS A PROBLEM WITH LINKING
        alert("Shader program FAILED TO LINK to the GPU!");
        return FAILURE;
    }

    // Here, you can USE THE PROGRAM. IT IS READY TO USE
    GL.useProgram(theProgram); // Canvas <-> Program <-> GPU

    console.log("The program is created");
    console.log(typeof(theProgram));
}

function main(){

    // GL'in yani bizim kanvasımızın bize webgl araçlarını verip vermediğini
    // kontrol etmemiz lazım.
    
    if (GL === null) {
        alert("Unable to initialize the canvas!");
        return FAILURE;
    }

    initializeShaders(); 
    // SHADERLARI YÜKLE, DERLE. HAZIR HALE GETİR.
    
    // HERE
    // Shaders have been INITIALIZED
    // COMPILED, CHECKED
    // GPU Program is CREATED, AND LINKED
    // And READY FOR USE


    
    // Drawing a Triangle
    // Üçgen Çizimi -> 3 köşenin kordinatlarını veriyorum
    // Ekranın ortası (0,0) -> Sağ üst (1,1), Sol Alt (-1,-1)

    var verticesofTriangle =    new Float32Array([ -1, -1,
                                                    1,-1,
                                                    0, 1]);
    // Three Vertices , 3 Nokta (köşe)

    // OpenGL is a STATE MACHINE
    // Vertex Shader Vertex bilgilerini parametre olarak almaz, 
    // Bufferdan okur.
    var bufferID = GL.createBuffer(); // create a new buffer to put vertices 
    GL.bindBuffer(GL.ARRAY_BUFFER , bufferID); // SELECT THIS BUFFER
    // Vertex Shader is going to use this BUFFER, STATE-MACHINE APPROACH
    // PUSH THE DATA TO THE BUFFER
    GL.bufferData(GL.ARRAY_BUFFER, verticesofTriangle, GL.STATIC_DRAW);
    // Amacımızı da söyledik. 
    
    // Associate out shader variables with our data buffer

    // Now, you have to tell the software WHAT YOU PUT TO THE BUFFER
    // Bufferın içine ne koydun? Renk mi, 3 boyutlu köşe bilgisi mi, tangent vektör mü?
    // EXPLAIN THE DATA
    
    // VERTEX-SHADER'a iletilecek olan bilgileri tanımlıyoruz.
    // "vertexPosition" olarak gidecek şeyi söylüyoruz.
    // BU HANGİ BİLGİ sorusunu yanıtlıyor, BU KÖŞE BİLGİSİ
    // VERTEX INFORMATION ı tanımlıyorum bu doğrudan vertex shadera gidiyor.
    var vertexPosition = GL.getAttribLocation(theProgram, "vertexPosition");
    // shadera vertex-position olarak gidecek.
    GL.vertexAttribPointer(vertexPosition, 2, GL.FLOAT, false, 0, 0); 
    // Bunun özelliklerini söylüyorum, VERTEX-SHADER PARAMETRELERİNDEN BİRİNİ TANIMLIYORUM
    /*
        binds the buffer currently bound to gl.ARRAY_BUFFER to a 
        generic vertex attribute of the current vertex buffer 
        object and specifies its layout.
    */
    // INDEX -> bu hangi özellik
    // SIZE -> kaç bileşen bu özelliğe ait, 3 boyutlu nokta da olabilirdi
    //      -> köşe kordinatı bilgisi 2 özellikli
    // TYPE -> türü FLOAT
    GL.enableVertexAttribArray(vertexPosition);
    // BUNU HAYATA GEÇİR.
    /*
        Either way, since attributes cannot be used unless enabled, and are disabled by default, 
        you need to call enableVertexAttribArray() to enable 
        individual attributes so that they can be used.
    */


    // NOW DRAW THE TRIANGLE

    // First PAINT BACKGROUND COLOR
    GL.clearColor(0.0, 0.0, 1.0, 0.8);
    GL.clear(GL.COLOR_BUFFER_BIT);

    // ON TOP OF BACKGROUND COLOR, DRAW THE TRIANGLE
    GL.drawArrays(GL.TRIANGLES, 0, 3);
    // RENDER PRIMITIVES(SHAPES) FROM ARRAY DATA
    // Arraydeki bilgilerden çizim yap
    // MODE -> TRIANGLE, LINE vs vs.
    // STARTING INDEX in the array
    // SIZE -> number of indices to be rendered
    

}

main(); // CALL MAIN FUNCTION to draw triangle