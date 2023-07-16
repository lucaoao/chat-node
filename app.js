let app = require("http").createServer(resposta);
let fs = require("fs");
let io = require("socket.io")(app);

app.listen(3000);
console.log("Aplicativo rodando.");
function resposta(req, res) {
  let arquivo = "";
  if (req.url === "/") {
    arquivo = "index.html";
  } else {
    arquivo = req.url;
  }
  fs.readFile(arquivo, function (err, data) {
    if (err) {
      res.writeHead(404);
      return res.end("Página ou arquivo não encontrados.");
    }
    res.writeHead(200);
    res.end(data);
  });
}

io.on("connection", function (socket) {
  socket.on("enviar mensagem", function (mensagemEnviada, callback) {
    mensagemEnviada = `[ ${pegarDataAtual} ]: ${mensagemEnviada}`;

    io.sockets.emit("atualizar mensagens", mensagemEnviada);
  });
});

function pegarDataAtual() {
  let dataAtual = new Date();
  let dia = (dataAtual.getDate() < 10 ? "0" : "") + dataAtual.getDate();
  let mes =
    (dataAtual.getMonth() + 1 < 10 ? "0" : "") + (dataAtual.getMonth + 1);
  let ano = dataAtual.getFullYear();
  let hora = dataAtual.getHours() < 10 ? "0" : "";
  let minuto = dataAtual.getMinutes() < 10 ? "0" : "";
  let segundo = dataAtual.getSeconds() < 10 ? "0" : "";

  let dataFormatada = `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;
  return dataFormatada;
}
