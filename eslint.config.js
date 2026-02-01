// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  ...expoConfig, // 배열 형태로 들어오므로 스프레드 연산자(...)를 사용하는 것이 안전합니다.
  {
    ignores: ["dist/*"],
  },
  {
    // 추가: 경로 별칭(Alias) 해결 설정
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
  }
]);