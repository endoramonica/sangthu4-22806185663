// ==================== READ: Tải toàn bộ dữ liệu posts ====================
async function LoadData() {
    try {
        let res = await fetch("http://localhost:3000/posts")
        let posts = await res.json();
        let body = document.getElementById("body_table");
        body.innerHTML = '';
        
        for (const post of posts) {
            // Hiển thị tất cả các post, cả những post bị xóa mềm
            // Nếu isDeleted = true, áp dụng style gạch ngang (strikethrough)
            const styleClass = post.isDeleted ? 'deleted-row' : '';
            
            body.innerHTML += `<tr class="${styleClass}">
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.views}</td>
                <td>
                    <input type="submit" value="Edit" onclick="Edit('${post.id}', '${post.title}', '${post.views}')"/>
                    ${!post.isDeleted ? `<input type="submit" value="Delete" onclick="Delete('${post.id}')"/>` : `<input type="submit" value="Restore" onclick="Restore('${post.id}')">`}
                </td>
            </tr>`
        }
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }
}
// ==================== CREATE: Thêm mới hoặc UPDATE: Cập nhật post ====================
async function Save() {
    let id = document.getElementById("id_txt").value;
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("view_txt").value;
    
    // Kiểm tra dữ liệu nhập vào
    if (!title || !views) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return false;
    }
    
    // Nếu ID để trống hoặc không có, tạo ID mới (maxId + 1)
    if (!id || id.trim() === '') {
        try {
            // Lấy tất cả posts để tính maxId
            let res = await fetch('http://localhost:3000/posts');
            let posts = await res.json();
            let maxId = 0;
            
            // Tìm ID lớn nhất và chuyển sang số để tính
            posts.forEach(post => {
                let numId = parseInt(post.id);
                if (numId > maxId) {
                    maxId = numId;
                }
            });
            
            // ID mới = maxId + 1, nhưng lưu dưới dạng chuỗi
            id = String(maxId + 1);
            
            // CREATE: Thêm mới post
            let createRes = await fetch('http://localhost:3000/posts', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id,
                    title: title,
                    views: parseInt(views),
                    isDeleted: false
                })
            });
            
            if (createRes.ok) {
                console.log("✓ CREATE: Thêm mới post thành công - ID: " + id);
                alert("Thêm mới thành công!");
            }
        } catch (error) {
            console.error("Lỗi khi thêm mới:", error);
        }
    } else {
        // UPDATE: Cập nhật post hiện có
        try {
            let updateRes = await fetch('http://localhost:3000/posts/' + id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id,
                    title: title,
                    views: parseInt(views),
                    isDeleted: false
                })
            });
            
            if (updateRes.ok) {
                console.log("✓ UPDATE: Cập nhật post thành công - ID: " + id);
                alert("Cập nhật thành công!");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
        }
    }
    
    // Xóa form và tải lại dữ liệu
    document.getElementById("id_txt").value = '';
    document.getElementById("title_txt").value = '';
    document.getElementById("view_txt").value = '';
    LoadData();
    return false;
}

// ==================== EDIT: Đổ dữ liệu vào form để chỉnh sửa ====================
function Edit(id, title, views) {
    console.log("✓ EDIT: Chọn post để chỉnh sửa - ID: " + id);
    document.getElementById("id_txt").value = id;
    document.getElementById("title_txt").value = title;
    document.getElementById("view_txt").value = views;
    document.getElementById("title_txt").focus();
}

// ==================== DELETE: Xóa mềm - Đánh dấu isDeleted = true ====================
async function Delete(id) {
    if (!confirm("Bạn có chắc chắn muốn xóa post này?")) {
        return false;
    }
    
    try {
        // DELETE (Soft Delete): chỉ cập nhật isDeleted: true, không xóa dữ liệu
        let res = await fetch("http://localhost:3000/posts/" + id, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                isDeleted: true
            })
        });
        
        if (res.ok) {
            console.log("✓ DELETE (Soft Delete): Xóa mềm post thành công - ID: " + id);
            alert("Xóa thành công!");
        }
    } catch (error) {
        console.error("Lỗi khi xóa:", error);
    }
    
    LoadData();
    return false;
}

// ==================== RESTORE: Khôi phục post - Đánh dấu isDeleted = false ====================
async function Restore(id) {
    if (!confirm("Bạn có chắc chắn muốn khôi phục post này?")) {
        return false;
    }
    
    try {
        // Khôi phục: cập nhật isDeleted: false
        let res = await fetch("http://localhost:3000/posts/" + id, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                isDeleted: false
            })
        });
        
        if (res.ok) {
            console.log("✓ RESTORE: Khôi phục post thành công - ID: " + id);
            alert("Khôi phục thành công!");
        }
    } catch (error) {
        console.error("Lỗi khi khôi phục:", error);
    }
    
    LoadData();
    return false;
}

// ==================== COMMENTS CRUD: Thêm comment cho post ====================
async function AddComment(postId, commentText) {
    if (!commentText || commentText.trim() === '') {
        alert("Vui lòng nhập nội dung comment!");
        return false;
    }
    
    try {
        // Lấy tất cả comments để tính maxId
        let res = await fetch('http://localhost:3000/comments');
        let comments = await res.json();
        let maxId = 0;
        
        comments.forEach(comment => {
            let numId = parseInt(comment.id);
            if (numId > maxId) {
                maxId = numId;
            }
        });
        
        // CREATE COMMENT: Tạo comment mới với ID = maxId + 1
        let commentRes = await fetch('http://localhost:3000/comments', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: String(maxId + 1),
                text: commentText,
                postId: postId,
                isDeleted: false
            })
        });
        
        if (commentRes.ok) {
            console.log("✓ CREATE COMMENT: Thêm comment thành công - Post ID: " + postId);
            alert("Thêm comment thành công!");
        }
    } catch (error) {
        console.error("Lỗi khi thêm comment:", error);
    }
}

// ==================== READ COMMENTS: Lấy comments của một post ====================
async function GetCommentsByPost(postId) {
    try {
        // READ COMMENTS: Lấy tất cả comments của post
        let res = await fetch("http://localhost:3000/comments?postId=" + postId);
        let comments = await res.json();
        
        // Lọc bỏ các comment bị xóa mềm
        let activeComments = comments.filter(c => !c.isDeleted);
        console.log("✓ READ COMMENTS: Lấy comments của post " + postId + " thành công. Số lượng: " + activeComments.length);
        return activeComments;
    } catch (error) {
        console.error("Lỗi khi lấy comments:", error);
        return [];
    }
}

// ==================== UPDATE COMMENT: Cập nhật nội dung comment ====================
async function UpdateComment(commentId, newText) {
    if (!newText || newText.trim() === '') {
        alert("Vui lòng nhập nội dung comment!");
        return false;
    }
    
    try {
        // UPDATE COMMENT: Cập nhật nội dung comment
        let res = await fetch("http://localhost:3000/comments/" + commentId, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: newText,
                isDeleted: false
            })
        });
        
        if (res.ok) {
            console.log("✓ UPDATE COMMENT: Cập nhật comment thành công - Comment ID: " + commentId);
            alert("Cập nhật comment thành công!");
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật comment:", error);
    }
}

// ==================== DELETE COMMENT: Xóa mềm comment ====================
async function DeleteComment(commentId) {
    if (!confirm("Bạn có chắc chắn muốn xóa comment này?")) {
        return false;
    }
    
    try {
        // DELETE COMMENT (Soft Delete): Chỉ cập nhật isDeleted: true
        let res = await fetch("http://localhost:3000/comments/" + commentId, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                isDeleted: true
            })
        });
        
        if (res.ok) {
            console.log("✓ DELETE COMMENT (Soft Delete): Xóa mềm comment thành công - Comment ID: " + commentId);
            alert("Xóa comment thành công!");
        }
    } catch (error) {
        console.error("Lỗi khi xóa comment:", error);
    }
}

// ==================== RESTORE COMMENT: Khôi phục comment ====================
async function RestoreComment(commentId) {
    if (!confirm("Bạn có chắc chắn muốn khôi phục comment này?")) {
        return false;
    }
    
    try {
        // RESTORE COMMENT: Cập nhật isDeleted: false
        let res = await fetch("http://localhost:3000/comments/" + commentId, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                isDeleted: false
            })
        });
        
        if (res.ok) {
            console.log("✓ RESTORE COMMENT: Khôi phục comment thành công - Comment ID: " + commentId);
            alert("Khôi phục comment thành công!");
        }
    } catch (error) {
        console.error("Lỗi khi khôi phục comment:", error);
    }
}

// Tải dữ liệu posts khi trang load
LoadData();