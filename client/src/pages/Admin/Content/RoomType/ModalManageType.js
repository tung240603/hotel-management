import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { postCreateRoomType, putUpdateRoomType } from '../../../../services/apiServices';

function ModalManageType({ show, setShow, modalType, title, dataType = {}, fetchAllRoomTypes }) {
    const [type, setType] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [listRoom, setListRoom] = useState([]);
    const [images, setImages] = useState(null);
    const [imagesSource, setImagesSource] = useState([]);

    useEffect(() => {
        if (show && !_.isEmpty(dataType) && modalType !== 'CREATE') {
            setType(dataType.typeOfRooms);
            setPrice(dataType.price);
            setDescription(dataType.description);
            setType(dataType.typeOfRooms);
            setListRoom(dataType.listRoom);
            if (dataType.imageUrls.length > 0) {
                setImagesSource(
                    dataType.imageUrls.map((image) => `${process.env.REACT_APP_SERVER_URL}${image.filePath}`),
                );
            }
        }
    }, [show]);

    const handleFilesChange = (event) => {
        const files = event.target.files;

        if (files && files.length > 0) {
            setImages(files);
            setImagesSource(Array.from(files).map((file) => URL.createObjectURL(file)));
        }
    };

    const handleClose = () => {
        // Xoa cac file preview
        if (imagesSource.length > 0) {
            imagesSource.forEach((imageSource) => URL.revokeObjectURL(imageSource));
        }

        setType('');
        setPrice(0);
        setDescription('');
        setImages(null);
        setImagesSource([]);
        setShow(false);
    };

    const handleSubmit = async () => {
        let isValidRoomType = true;

        if (!type) {
            toast.error('Not empty type!');
            isValidRoomType = false;
        }

        if (price < 0 || isNaN(price)) {
            toast.error('Invalid price!');
            isValidRoomType = false;
        }

        if (!description) {
            toast.error('Not empty description!');
            isValidRoomType = false;
        }

        if (_.isEmpty(imagesSource)) {
            toast.error('Not empty images!');
            isValidRoomType = false;
        }

        if (isValidRoomType === false) return;

        const formData = new FormData();

        formData.append('typeOfRooms', type);
        formData.append('price', price);
        formData.append('description', description);
        if (modalType === 'CREATE') {
            formData.append('listRoom', []);
        } else if (modalType === 'EDIT') {
            formData.append('listRoom', listRoom);
        }

        if (images && images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                formData.append('images', images[i]);
            }
        } else {
            formData.append('images', []);
        }

        let res;
        if (modalType === 'CREATE') {
            res = await postCreateRoomType(formData);
        } else if (modalType === 'EDIT') {
            res = await putUpdateRoomType(dataType._id, formData);
        }

        if (res && res.data && res.data.success === true) {
            toast.success(res.data.message);
            fetchAllRoomTypes();
            handleClose();
        } else {
            toast.error(res.message);
        }
    };

    return (
        <>
            <Modal className="modal-manage-type" show={show} onHide={handleClose} backdrop="static" size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Type</label>
                                <input
                                    value={type}
                                    onChange={(event) => setType(event.target.value)}
                                    type="text"
                                    className="form-control"
                                    disabled={modalType === 'VIEW'}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Price</label>
                                <input
                                    value={price}
                                    onChange={(event) => setPrice(+event.target.value)}
                                    type="text"
                                    className="form-control"
                                    disabled={modalType === 'VIEW'}
                                />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    className="form-control description"
                                    placeholder="Description"
                                    disabled={modalType === 'VIEW'}
                                />
                            </div>
                            <div className="col-md-12">
                                <label
                                    htmlFor={`upload-type-image-${dataType._id}`}
                                    className="btn btn-success upload-images-btn"
                                >
                                    <BsFillPlusCircleFill />
                                    Upload new file images
                                </label>

                                <input
                                    onChange={handleFilesChange}
                                    id={`upload-type-image-${dataType._id}`}
                                    type="file"
                                    multiple
                                    hidden
                                    disabled={modalType === 'VIEW'}
                                />

                                <div className="preview-images">
                                    {imagesSource && imagesSource.length > 0 ? (
                                        <div className="row">
                                            {imagesSource.map((imageSource) => (
                                                <div key={imageSource} className="col-3">
                                                    <div className="preview-item">
                                                        <img src={imageSource} alt="Preview room type" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="no-image">
                                            <span>Preview Image</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {modalType !== 'VIEW' && (
                        <Button disabled={modalType === 'EDIT'} variant="primary" onClick={handleSubmit}>
                            Save
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalManageType;