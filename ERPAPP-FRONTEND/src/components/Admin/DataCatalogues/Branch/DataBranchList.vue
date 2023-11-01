<script>
    export default {
        props: {
            listData: {type: Array, default: []},
        },
    }
</script>

<template>
    <tbody>
        <tr v-for="row in listData" :key="row.id_chinhanh">
            <th scope="row">{{ row.id_chinhanh }}</th>
            <td>{{ row.tenchinhanh }}</td>
            <td>{{ row.sonha + ', ' + row.tenphuongxa + ', ' + row.tenquanhuyen + ', ' + row.tentinhthanh + '.' }}</td>
            <td class="list_action"><button @click="$emit('update', row.id_chinhanh)"><font-awesome-icon :icon=row.act_icon /></button></td>
        </tr>
    </tbody>
</template>

<style>
    @import '@/assets/DataCatalogues/branchlist.css';
</style>