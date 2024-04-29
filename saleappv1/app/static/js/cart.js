function addToCart(id, name, price) {
    fetch('/api/cart', {
        method: 'post',
        body: JSON.stringify({
            "id": id,
            "name": name,
            "price": price
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function(res) {
        return res.json();
    }).then(function(data) {
        let items = document.getElementsByClassName("cart-counter");
        for (let item of items)
            item.innerText = data.total_quantity
    });
}

function updateCart(id, obj) {
    obj.disabled = true;
    fetch(`/api/cart/${id}`, {
        method: 'put',
        body: JSON.stringify({
            "quantity": obj.value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function(res) {
        return res.json();
    }).then(function(data) {
        obj.disabled = false;
        let items = document.getElementsByClassName("cart-counter");
        for (let item of items)
            item.innerText = data.total_quantity
    });
}

function deleteCart(id, obj) {
    obj.disbaled = true;
    if (confirm("Ban chac chan xoa khong?") === true) {
        fetch(`/api/cart/${id}`, {
            method: 'delete'
        }).then(function(res) {
            return res.json();
        }).then(function(data) {
            obj.disabled = false;
            let items = document.getElementsByClassName("cart-counter");
            for (let item of items)
                item.innerText = data.total_quantity

            let d = document.getElementById(`product${id}`);
            d.style.display = "none";
        });
    }
}

function pay() {
   if (confirm("Bạn chắc chắn thanh toán?") === true) {
        fetch("/api/pay", {
            method: 'post'
        }).then(res => res.json()).then(data => {
            if (data.status === 200)
                location.reload()
            else
                alert(data.err_msg)
        })
   }
}

function addComment(id) {
    if (confirm("Bạn chắc chắn bình luận?") === true) {
    fetch(`/api/products/${id}/comments`, {
            method: 'post',
            body: JSON.stringify({
                "content": document.getElementById('comment').value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(res) {
            return res.json();
        }).then(function(data) {
            if (data.status === 200) {
                let c = data.comment;
                let html = document.getElementById("comments");
                html.innerHTML = `
                 <div class="row alert alert-info">
                        <div class="col-md-1 col-xs-4">
                            <img src="${c.user.avatar}" class="img-fluid rounded" />
                        </div>
                        <div class="col-md-11 col-xs-8">
                            <p><strong>${c.content}</strong></p>
                            <p>Bình luận lúc: <span class="date">${moment(c.created_date).locale("vi").fromNow()}</span></p>
                        </div>
                    </div>
                ` + html.innerHTML
            } else
                alert(data.err_msg)
        });
    }
}