// Select Item in DOM

const form=document.getElementById("itemform");
const inpuItem=document.getElementById("inputItem");
const itemsList=document.getElementById("itemsList");
const alertDiv=document.getElementById("message");
const filters = document.querySelectorAll(".nav-item");

// Create Empty Item List
let todoItems=[];

const alertMessage=function(message,className){
    alertDiv.innerHTML=message;
    alertDiv.classList.add(className,"show");
    alertDiv.classList.remove("hide");
    setTimeout(()=>{
        alertDiv.classList.add("hide");
        alertDiv.classList.remove("show");
    },3000);
    return;
    console.log(message);
}

// filter items
const getItemsFilter=function(type){
    let filterItems=[];
    switch (type) {
        case "toDo":
        {
            filterItems=todoItems.filter((items)=>!items.isDone);
            break;
        }
        case "Completed":
        {
            filterItems=todoItems.filter((items)=>items.isDone);
            break;
        }    
        default:
            filterItems=todoItems;
            break;
    }
    getList(filterItems);
}

// Delete Item
const removeItem=function(item){
    const removeIndex=todoItems.indexOf(item);
    todoItems.splice(removeIndex,1);
}

// updateItem
const updateItem=function(currentItemIndex,value)
{
    const newItem=todoItems[currentItemIndex];
    newItem.name=value;
    todoItems.splice(currentItemIndex,1,newItem);
    setlocalStorage(todoItems);
}

const handleitem=(itemsData)=>{
    const item=document.querySelectorAll(".list-group-item");
    item.forEach(items => {
        if(items.querySelector(".title").getAttribute("data-time")==itemsData.addedAt)
        {
            // done
            items
                .querySelector("[data-done]")
                .addEventListener("click",function (e){
                    e.preventDefault();
                    const itemIndex= todoItems.indexOf(itemsData);
                    const currentItem=todoItems[itemIndex];
                    const currentClass=currentItem.isDone?"bi-check-circle-fill":"bi-check-circle";
                    currentItem.isDone=currentItem.isDone?false:true;
                    todoItems.splice(itemIndex,1,currentItem);
                    setlocalStorage(todoItems);
                    const iconClass= currentItem.isDone?"bi-check-circle-fill":"bi-check-circle";
                    this.firstElementChild.classList.replace(currentClass,iconClass);
                    const filterType= document.getElementById("tabValue").value;
                    getItemsFilter(filterType); 
                });

            // Edit
            items
                .querySelector("[data-edit]")
                .addEventListener("click",function (e){
                    e.preventDefault();
                    // alert("ok");
                    inpuItem.value=itemsData.name;
                    document.querySelector("#objIndex").value=todoItems.indexOf(itemsData);
                    return todoItems;
                });


            // Delete
            items
                .querySelector("[data-delete]")
                .addEventListener("click",function (e){
                    e.preventDefault();
                    // alert("ok");
                    if(confirm("Are you sure to remove this item? "))
                    {
                        itemsList.removeChild(items);
                        removeItem(items);
                        setlocalStorage(todoItems);
                        return todoItems.filter((items)=>items!=itemsData);
                    }
                });

        }
    });
}
// get list of items
const getList=(todoItems)=>{
    itemsList.innerHTML="";
    if(todoItems.length>0)
    {
        todoItems.forEach(items => {
            const iconClass=items.isDone?"bi-check-circle-fill":"bi-check-circle";
            itemsList.insertAdjacentHTML("beforeend",
                    `<li class="list-group-item d-flex justify-content-between fs-3">
                        <span class="title" data-time="${items.addedAt}">${items.name}</span>
                        <span class="">
                            <a href="" data-done><i class="bi ${iconClass} text-success"></i></a>
                            <a href="" data-edit><i class="bi bi-pencil-square"></i></a>
                            <a href="" data-delete><i class="bi bi-x-circle text-danger"></i></a>
                        </span>
                    </li>`);
            handleitem(items);
        });
    }
    else
    {
        itemsList.insertAdjacentHTML("beforeend",
                    `<li class="list-group-item d-flex justify-content-between fs-3">
                        <span>No Record Found</span>
                    </li>`);
    }
}

// Get Data from local Storage
const setlocalStorage = (todoItems)=>{
    localStorage.setItem("todoItems",JSON.stringify(todoItems));
}

// Set in local Storage
const getlocalStorage = ()=>{
    const todoStorage=localStorage.getItem("todoItems");
    if(todoStorage==="undefined"|| todoStorage===null){
        todoItems=[];
    } else {
        todoItems = JSON.parse(todoStorage);
    }
    // console.log("items",todoItems);
    getList(todoItems);
}

// DoM Manipulation
// Getting Values
document.addEventListener("DOMContentLoaded",()=>{
    form.addEventListener("submit",(e)=>{
        e.preventDefault();
        const itemName =inpuItem.value.trim();
        if(itemName.length===0){
            
            alertMessage("Please Enter Name","alert-danger");
        }
        else
        {

            const currentItemIndex=document.querySelector("#objIndex").value;
            if(currentItemIndex){
                // update
                updateItem(currentItemIndex,itemName);
                document.querySelector("#objIndex").value="";
            }
            else
            {

                // console.log(inputItem.value);
                const itemObj={
                    name:itemName,
                    addedAt:new Date().getTime(),
                    isDone:false
                };
                todoItems.push(itemObj);
                setlocalStorage(todoItems);
            }
            getList(todoItems);
        }
        inpuItem.value="";
    });


    // filter tabs
    filters.forEach((tab)=>{
        tab.addEventListener("click",function(e){
            e.preventDefault();
            const tabType=this.getAttribute("data-type");
            // console.log(tabType);
            document.querySelectorAll(".nav-link").forEach((nav)=>{
                nav.classList.remove("active");
            });
            this.firstElementChild.classList.add("active");
            getItemsFilter(tabType);
            document.getElementById("tabValue").value=tabType;
        });
    });
    // Load Items
    getlocalStorage();
});

