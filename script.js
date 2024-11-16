import cryptoUtils from './cryptoUtils.js';

document.getElementById('encryptButton').addEventListener('click', async () => {
    console.log('[App] Botão de criptografia clicado.');
    const fileInput = document.getElementById('fileInput').files[0];
    const password = document.getElementById('passwordInput').value;
    const output = document.getElementById('output');

    if (!fileInput || !password) {
        output.textContent = 'Selecione um arquivo e insira uma senha.';
        console.warn('[App] Arquivo ou senha não fornecidos.');
        return;
    }

    try {
        const fileBuffer = await fileInput.arrayBuffer();
        console.log('[App] Buffer do arquivo carregado:', fileBuffer);

        const encryptedBlob = await cryptoUtils.encryptFile(fileBuffer, password);

        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(encryptedBlob);
        downloadLink.download = `${fileInput.name}.enc`;
        downloadLink.click();

        output.textContent = 'Arquivo criptografado com sucesso!';
        console.log('[App] Criptografia concluída.');
    } catch (err) {
        output.textContent = 'Erro durante a criptografia: ' + err.message;
        console.error('[App] Erro durante a criptografia:', err);
    }
});

document.getElementById('decryptButton').addEventListener('click', async () => {
    console.log('[App] Botão de descriptografia clicado.');
    const fileInput = document.getElementById('fileInput').files[0];
    const password = document.getElementById('passwordInput').value;
    const output = document.getElementById('output');

    if (!fileInput || !password) {
        output.textContent = 'Selecione um arquivo e insira uma senha.';
        console.warn('[App] Arquivo ou senha não fornecidos.');
        return;
    }

    try {
        const fileBuffer = await fileInput.arrayBuffer();
        console.log('[App] Buffer do arquivo carregado para descriptografia:', fileBuffer);

        const decryptedBuffer = await cryptoUtils.decryptFile(fileBuffer, password);

        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(new Blob([decryptedBuffer]));
        downloadLink.download = fileInput.name.replace('.enc', '');
        downloadLink.click();

        output.textContent = 'Arquivo descriptografado com sucesso!';
        console.log('[App] Descriptografia concluída.');
    } catch (err) {
        output.textContent = 'Erro durante a descriptografia: ' + err.message;
        console.error('[App] Erro durante a descriptografia:', err);
    }
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(() => console.log('[Service Worker] Registrado com sucesso.'))
        .catch((error) => console.error('[Service Worker] Falha ao registrar:', error));
}
