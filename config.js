// ===== Frontend Configuration (NO PRIVATE KEY HERE) =====
const CONFIG = {

    // Company wallet address (public info)
    COMPANY_WALLET_ADDRESS: "0x5CAE94A3F078252f1B9Ced4106eC0B5bE642334F",

    // Escrow contract address
    ESCROW_CONTRACT_ADDRESS: "0x84bcDB7d83944358481Eb4C1425831218f28368c",

    // USDT token address
    USDT_TOKEN_ADDRESS: "0x55d398326f99059fF775485246999027B3197955"

};

// Make CONFIG available globally
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}


