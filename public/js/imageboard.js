

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
            comments: [],
            name: "",

            comment_username: "",
            comment_comment_text: "",
        };
    }, 

    methods: {

        closeSign: function() {
            console.log("close this sign");
            this.$emit('close');
            // window.location.hash = "";  url zurücksetzten
        },

        loadImage: function () {
            axios.get("/api/v1/image/" + this.id).then((response) => {
                if (response.data) {
                    this.title = response.data.title;
                    this.description = response.data.description;
                    this.imageURL = response.data.url;
                } else {
                    console.log(
                        "Did not receive anything useful. Image probably does not exist."
                    );
                    alert("Sorry, image does not exist...");
                    this.closeMe();
                }
            });
        },


        loadComments: function() {
            axios.get("/api/v1/comments-image/" + this.id)
                .then((response) => {
                    if(response.data) {
                        this.comments = response.data;
                    } else {
                        console.log("no data in response")
                    }
                })
        },

        sendComment: function() {

        const myData = new FormData();
        myData.append("username", this.comment_username);
        myData.append("comment_text", this.comment_comment_text);
        myData.append("image_id", this.id);

        axios.post("/api/v1/comments-create", myData)
            .then((response) => {
                if(response.status == 200) {
                    this.comments.push(response.data);
                    this.comment_comment_text = "";
                    this.comment_username = "";
                }
            })

        },

    },
    
    mounted: function () {
        this.loadImage();
        this.loadComments();
    },

    watch: {
        id: function () {
            this.loadImage();
            this.loadComments();
        },
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
    // mounted: function() {
    //     axios.get('/api/v1/image/' + this.id).then((response) => {
    //         this.title = response.data.title;
    //         this.description = response.data.description;
    //         this.imageURL = response.data.url;
    //     });
    // },
});
