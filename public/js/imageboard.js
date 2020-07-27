

new Vue({
    el: '#main',
    data: {
        title: "",
        username: "",
        description: "",
        file: "",
    
        images: [],
        selectedImageId: false //!!!
        // showButton: true,
    },
    methods: {
        fileChanged: function(event) {
            this.file = event.target.files[0];
        },
        uploadImage: function(event) {
            event.preventDefault();

            const myData = new FormData();

            myData.append("title", this.title);
            myData.append("username", this.username);
            myData.append("description", this.description);
            myData.append("file", this.file);

            

            axios.post("/upload", myData).then((response) => {

                this.images.unshift({
                    title: this.title,
                    url: response.data.fileURL,
                });

                this.title = "";
                this.file = "";
                this.description = "";
                this.file = "";

                })
            
        },

        // loadmore: function() {

        //     const lastImage = this.images[this.images.length-1]
        //     console.log("load images");
        //     axios.get("/").then(response => {
        //         //!!!
        //     })
        // }
    },

    mounted() {
        axios.get('/api/v1/images').then(response => {
            this.images = response.data;  
        });
    },

    // addEventListener("hashchange", () => {
    //     this.selectedImageId = windowm.location.hash.replace("#", "");
    // })
});


Vue.component('overlay', { // name des tags
    template: '#templateOverlay',
    props: ["id"],//Daten von außen, können nicht geändert werden
    data: function() { //Daten von innen, kann ich ändern
        return {
            title: "",
            username: "",
            description: "",
            imageURL: "",
            comment: [],
            name: "",
        };
    }, 

    mounted: function() {
        axios.get('/api/v1/image/' + this.id).then((response) => {
            this.title = response.data.title;
            this.description = response.data.description;
            this.imageURL = response.data.url;
        });
    },    
    
    // mounted:
    //     // In our image board, we want to make an AJaX call here
    //     // and we want to use this property from outside (selectedImage)
    //     // to load the correct image
    //     // axios.get("/api/v1/images/2")
    
    methods: {
        closeSign: function() {
            console.log("close this sign");
            this.$emit('close');
            // window.location.hash = "";  url zurücksetzten
        }
    },

    // watch: {
    //     id: function() {
    //         axios.get('/api/v1/image/' + this.id).then((response) => {
    //             this.title = response.data.title;
    //             this.description = response.data.description;
    //             this.imageURL = response.data.url;
    //         });
    //     }
    // }
});
