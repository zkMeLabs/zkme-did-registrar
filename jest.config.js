module.exports = {
    clearMocks: true,
    verbose: true,
    testEnvironment: "node",
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    transformIgnorePatterns: [
        "/node_modules/", "\\.pnp\\.[^\\\/]+$"
    ],
    globals: {
        Uint8Array: Uint8Array,
        ArrayBuffer: ArrayBuffer
    }
};
