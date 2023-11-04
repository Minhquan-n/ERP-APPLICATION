<template>
    <div id="pageNotFound">
        <h1>404 PAGE NOT FOUND!</h1>
        <router-link :to="{name: 'LoginPage'}">
            Back to Home
        </router-link>
    </div>
</template>

<style>
    #pageNotFound {
        width: 100%;
        height: 500px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    a {
        font-size: large;
    }
</style>