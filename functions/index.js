require("dotenv").config();
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { google } = require("googleapis");
const cors = require("cors")({ origin: true });

admin.initializeApp();

/* ========= CONFIGURAÇÕES ========= */
const SPREADSHEET_ID = "1kKdufdnBwVvNquC4846Tmka5EUInpvMasKBks17cyLM";
const ABA = "SERVICOS";
const DRIVE_ROOT_FOLDER_ID = "19tZ8sSV1hxKkIsFhkDz1g24fSL0RIKho";

/* ========= chave api openAI ========= */
const OpenAI = require("openai");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
/* ========= AUTH GOOGLE ========= */
const auth = new google.auth.GoogleAuth({
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
  ]
});

const sheets = google.sheets("v4");
const drive = google.drive("v3");

/* ========= FUNÇÃO ========= */
exports.salvarServico = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method !== "POST") {
        return res.status(405).json({ success: false, erro: "Método inválido" });
      }

      const {
        status,
        nota,
        cliente,
        empresa,
        descricao,
        checklist,
        fotos
      } = req.body;

      const authClient = await auth.getClient();

      /* ========= ID SERVIÇO ========= */
      const idServico = "SRV-" + Date.now();

      /* ========= CRIAR PASTA ========= */
      const pasta = await drive.files.create({
        auth: authClient,
        resource: {
          name: idServico,
          mimeType: "application/vnd.google-apps.folder",
          parents: [DRIVE_ROOT_FOLDER_ID]
        },
        fields: "id"
      });

      const pastaId = pasta.data.id;

      /* ========= SALVAR FOTOS ========= */
      if (Array.isArray(fotos)) {
        for (const foto of fotos) {
          const buffer = Buffer.from(foto.dados, "base64");

          await drive.files.create({
            auth: authClient,
            resource: {
              name: foto.nome,
              parents: [pastaId]
            },
            media: {
              mimeType: foto.tipo,
              body: buffer
            }
          });
        }
      }

      /* ========= DATA ========= */
      const data = new Date().toLocaleString("pt-BR");

      /* ========= INSERIR LINHA A2 ========= */
      await sheets.spreadsheets.values.append({
        auth: authClient,
        spreadsheetId: SPREADSHEET_ID,
        range: `${ABA}!A2`,
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          values: [[
            idServico,
            data,
            status,
            nota,
            cliente,
            empresa,
            descricao,
            checklist,
            pastaId
          ]]
        }
      });

      return res.json({
        success: true,
        idServico
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        erro: err.message
      });
    }
  });
});
