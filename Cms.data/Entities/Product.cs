using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Cms.data.Entities
{
    public class Product
    {
        public int Id { get; set; }

        [Required(
            ErrorMessage =
            "Tên sản phẩm không được để trống"
        )]

        [StringLength(
            100,
            ErrorMessage =
            "Tên tối đa 100 ký tự"
        )]

        public string Name
        {
            get;
            set;
        }

        [Required(
            ErrorMessage =
            "Mô tả không được để trống"
        )]

        public string Description
        {
            get;
            set;
        }

        [Range(
            1,
            999999999,
            ErrorMessage =
            "Giá phải lớn hơn 0"
        )]

        public decimal Price
        {
            get;
            set;
        }

        [Range(
            0,
            999999,
            ErrorMessage =
            "Số lượng không hợp lệ"
        )]

        public int StockQuantity
        {
            get;
            set;
        }

        public string ImageUrl
        {
            get;
            set;
        }

        //---------------------------------
        // FOREIGN KEY
        //---------------------------------

        [Required(
            ErrorMessage =
            "Phải chọn Category"
        )]

        public int CategoryProductId
        {
            get;
            set;
        }

        public virtual CategoryProduct
            CategoryProduct
        {
            get;
            set;
        }

        //---------------------------------
        // RELATIONSHIP
        //---------------------------------

        public virtual ICollection<OrderDetail>
            OrderDetails
        {
            get;
            set;
        }
    }
}