// ===============================
// LENS IA
// ===============================

const input = document.getElementById("imagemInput");
const dropArea = document.getElementById("dropArea");

const preview = document.getElementById("previewImagem");

const btnEscolher = document.getElementById("btnEscolher");
const btnCamera = document.getElementById("btnCamera");
const btnAnalisar = document.getElementById("btnAnalisar");

const loading = document.getElementById("loading");

const resultado = document.getElementById("resultado");
const resultadoConteudo = document.getElementById("resultadoConteudo");

let arquivoSelecionado = null;

//===============================
// BOTÕES
//===============================

btnEscolher.onclick = () => {

    input.removeAttribute("capture");
    input.click();

};

btnCamera.onclick = () => {

    input.setAttribute("capture","environment");
    input.click();

};

//===============================
// ESCOLHA DA IMAGEM
//===============================

input.onchange = (e)=>{

    if(!e.target.files.length) return;

    carregarImagem(e.target.files[0]);

};

//===============================
// DRAG & DROP
//===============================

dropArea.addEventListener("dragover",(e)=>{

    e.preventDefault();

    dropArea.classList.add("hover");

});

dropArea.addEventListener("dragleave",()=>{

    dropArea.classList.remove("hover");

});

dropArea.addEventListener("drop",(e)=>{

    e.preventDefault();

    dropArea.classList.remove("hover");

    if(e.dataTransfer.files.length){

        carregarImagem(e.dataTransfer.files[0]);

    }

});

//===============================
// CARREGA IMAGEM
//===============================

function carregarImagem(file){

    arquivoSelecionado = file;

    const reader = new FileReader();

    reader.onload = function(ev){

        preview.src = ev.target.result;

        preview.style.display="block";

        resultado.style.display="none";

    };

    reader.readAsDataURL(file);

}

//===============================
// ANALISAR
//===============================

btnAnalisar.onclick = ()=>{

    if(!arquivoSelecionado){

        alert("Escolha uma imagem.");

        return;

    }

    analisarImagem();

};

//===============================
// SIMULA ANÁLISE
//===============================

async function analisarImagem(){

    loading.style.display="block";

    resultado.style.display="none";

    await new Promise(r=>setTimeout(r,2000));

    loading.style.display="none";

    resultado.style.display="block";

    resultadoConteudo.innerHTML = `

<div class="cardResultado">

<img src="${preview.src}">

<div class="info">

<div class="item">
<b>Status:</b>
Imagem carregada com sucesso
</div>

<div class="item">
<b>Nome:</b>
Aguardando OpenAI
</div>

<div class="item">
<b>Categoria:</b>
---
</div>

<div class="item conf">
Confiança:
--
</div>

</div>

</div>

`;

}