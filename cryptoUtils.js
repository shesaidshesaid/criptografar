const cryptoUtils = {
    IV_LENGTH_BYTE: 12,
    TAG_LENGTH_BIT: 128,

    async generateKey(password) {
        console.log('[cryptoUtils] Iniciando geração de chave...');
        try {
            const encoder = new TextEncoder();
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                encoder.encode(password),
                'PBKDF2',
                false,
                ['deriveKey']
            );
            console.log('[cryptoUtils] Material da chave gerado com sucesso.');

            const key = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: encoder.encode('fixedSaltValue'),
                    iterations: 100000,
                    hash: 'SHA-256',
                },
                keyMaterial,
                { name: 'AES-GCM', length: 128 },
                false,
                ['encrypt', 'decrypt']
            );
            console.log('[cryptoUtils] Chave AES gerada com sucesso.');
            return key;
        } catch (err) {
            console.error('[cryptoUtils] Erro ao gerar chave:', err);
            throw err;
        }
    },

    async encryptFile(data, password) {
        console.log('[cryptoUtils] Iniciando criptografia...');
        try {
            const key = await this.generateKey(password);
            const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH_BYTE));
            console.log('[cryptoUtils] IV gerado:', iv);

            const encrypted = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                data
            );

            const combined = new Uint8Array(iv.length + encrypted.byteLength);
            combined.set(iv);
            combined.set(new Uint8Array(encrypted), iv.length);
            console.log('[cryptoUtils] Criptografia concluída.');

            return new Blob([combined]);
        } catch (err) {
            console.error('[cryptoUtils] Erro durante criptografia:', err);
            throw err;
        }
    },

    async decryptFile(data, password) {
        console.log('[cryptoUtils] Iniciando descriptografia...');
        try {
            const key = await this.generateKey(password);
            const iv = data.slice(0, this.IV_LENGTH_BYTE);
            const encryptedData = data.slice(this.IV_LENGTH_BYTE);
            console.log('[cryptoUtils] IV extraído:', iv);

            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: new Uint8Array(iv) },
                key,
                encryptedData
            );
            console.log('[cryptoUtils] Descriptografia concluída.');

            return decrypted;
        } catch (err) {
            console.error('[cryptoUtils] Erro durante descriptografia:', err);
            throw err;
        }
    },
};

export default cryptoUtils;
