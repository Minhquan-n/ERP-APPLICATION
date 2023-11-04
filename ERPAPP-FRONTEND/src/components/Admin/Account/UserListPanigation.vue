<script>
    export default {
        props: {
            page: {type: Number, default: 1},
            currentPage: {type: Number, default: 1}
        }
    }
</script>

<template>
    <div id="pagination">
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li v-for="n in page" 
                    class="page-item" 
                    :class="[currentPage === n ? 'active' : '']" 
                    @click="$emit('change', n)"
                >
                    <a class="page-link">
                        {{ n }}
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<style>
    #pagination {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .page-item {
        cursor: pointer;
    }
</style>