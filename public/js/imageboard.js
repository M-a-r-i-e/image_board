

new Vue({
    el: '#main',
    data: {
        title: "",
        file: "",
        images: []
    },
    methods: {
        fileChanged: function(event) {
            this.file = event.target.files[0];
        },
        uploadImage: function(event) {
            event.preventDefault();

            const myData = new FormData();

            myData.append("title", this.title);

            myData.append("file", this.file);

            axios.post ("/upload", myData).then(result => {

                axios.post("/upload", myData).then(response => {

                this.images.unshift({
                    title: this.title,
                    url: result.data.fileURL,
                    url: response.data.fileURL
                });

                this.title = "";
                this.file = "";

                })
            })
        }
    },

    mounted() {
        axios.get('/api/v1/images').then(result => {
            this.images = result.data;  
            
            axios.get("/api/v1/images").then((response) => {
                this.images = response.data;
            });
        });
    },
});