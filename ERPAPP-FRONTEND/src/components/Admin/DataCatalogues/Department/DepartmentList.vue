<script>
    export default {
        props: {
            listData: {type: Array, default: []},
        },
    }
</script>

<template>
    <tbody>
        <tr v-for="row in listData" :key="row.id_bophan">
            <th scope="row">{{ row.id_bophan }}</th>
            <td>{{ row.tenbophan }}</td>
            <td class="list_action"><button @click="$emit('update', row.id_bophan)"><font-awesome-icon :icon=row.act_icon /></button></td>
        </tr>
    </tbody>
</template>

<style>
    @import '@/assets/DataCatalogues/branchlist.css';
</style>