// ===== Frontend Configuration (NO PRIVATE KEY HERE) =====
const CONFIG = {

    // Company wallet address (public info)
    COMPANY_WALLET_ADDRESS: "0xCF2A56Aeb006aF2745E33Fa4e23DA59CD79c8772",

    // Escrow contract address
    ESCROW_CONTRACT_ADDRESS: "0xcb34a89879cc72D94897d226D41eB8A71cAFc1B7",

    // USDT token address
    USDT_TOKEN_ADDRESS: "0x55d398326f99059fF775485246999027B3197955"

};

// Make CONFIG available globally
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

