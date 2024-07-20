<template>
    <div>123</div>
</template>

<script setup>
import { onMounted, ref } from "vue";

import { loginApi } from "@/api/auth";
const getlist = async () => {
    const res = await loginApi({
        username: "mengxuegu",
        password: "123456",
    });
    console.log(res);
};

onMounted(() => {
    getlist();
});
</script>

<style scoped lang="scss"></style>
