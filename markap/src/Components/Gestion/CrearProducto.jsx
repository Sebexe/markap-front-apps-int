import { useForm, Controller } from "react-hook-form";
import axiosClient from "../../config/axiosClient.js";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const CrearProducto = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const queryClient = useQueryClient();

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            descripcion: '',
            precio: '',
            detalles: '',
            stock: '',
            categoria: '',
            imagen: null
        }
    });

    // Fetch categories
    const { data: categorias } = useQuery({
        queryKey: ['Categorias'],
        queryFn: () => axiosClient.get("/productos/categoria").then((res) => res.data),
    });

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            setSuccessMessage(null);
            setErrorMessage(null);

            const formData = new FormData();
            formData.append("imagen", data.imagen[0]);
            formData.append("descripcion", data.descripcion);
            formData.append("precio", data.precio);
            formData.append("detalles", data.detalles);
            formData.append("stock", data.stock);
            formData.append("categoria", data.categoria);

            await axiosClient.post("/productos", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setSuccessMessage("Producto creado exitosamente");
            queryClient.invalidateQueries(['Productos']);
            reset();
            setTimeout(() => {
                setIsOpen(false);
                setSuccessMessage(null);
            }, 2000);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Error al crear el producto");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
                Crear Producto
            </button>
            <dialog id="modal_crear_producto" className={`modal ${isOpen ? 'modal-open' : ''}`}>
                <div className="modal-box w-11/12 max-w-5xl">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                        <h3 className="font-bold text-lg">Nuevo Producto</h3>
                        {errorMessage && <div className="alert alert-error">{errorMessage}</div>}
                        {successMessage && <div className="alert alert-success">{successMessage}</div>}

                        <Controller
                            name="descripcion"
                            control={control}
                            rules={{ required: "La descripción es obligatoria" }}
                            render={({ field }) => (
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Descripción</span>
                                    </label>
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="Ingrese la descripción del producto"
                                        className={`input input-bordered ${errors.descripcion ? 'input-error' : ''}`}
                                    />
                                    {errors.descripcion && <span className="text-error text-sm">{errors.descripcion.message}</span>}
                                </div>
                            )}
                        />

                        <Controller
                            name="precio"
                            control={control}
                            rules={{ required: "El precio es obligatorio" }}
                            render={({ field }) => (
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Precio</span>
                                    </label>
                                    <input
                                        {...field}
                                        type="number"
                                        step="0.01"
                                        placeholder="Ingrese el precio del producto"
                                        className={`input input-bordered ${errors.precio ? 'input-error' : ''}`}
                                    />
                                    {errors.precio && <span className="text-error text-sm">{errors.precio.message}</span>}
                                </div>
                            )}
                        />

                        <Controller
                            name="detalles"
                            control={control}
                            rules={{ required: "Los detalles son obligatorios" }}
                            render={({ field }) => (
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Detalles</span>
                                    </label>
                                    <textarea
                                        {...field}
                                        placeholder="Ingrese los detalles del producto"
                                        className={`textarea textarea-bordered ${errors.detalles ? 'textarea-error' : ''}`}
                                    />
                                    {errors.detalles && <span className="text-error text-sm">{errors.detalles.message}</span>}
                                </div>
                            )}
                        />

                        <Controller
                            name="stock"
                            control={control}
                            rules={{ required: "El stock es obligatorio" }}
                            render={({ field }) => (
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Stock</span>
                                    </label>
                                    <input
                                        {...field}
                                        type="number"
                                        placeholder="Ingrese el stock del producto"
                                        className={`input input-bordered ${errors.stock ? 'input-error' : ''}`}
                                    />
                                    {errors.stock && <span className="text-error text-sm">{errors.stock.message}</span>}
                                </div>
                            )}
                        />

                        <Controller
                            name="categoria"
                            control={control}
                            rules={{ required: "La categoría es obligatoria" }}
                            render={({ field }) => (
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Categoría</span>
                                    </label>
                                    <select
                                        {...field}
                                        className={`select select-bordered ${errors.categoria ? 'select-error' : ''}`}
                                    >
                                        <option value="">Seleccione una categoría</option>
                                        {categorias?.map((categoria) => (
                                            <option key={categoria.id} value={categoria.id.toString()}>
                                                {categoria.nombreCategoria}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.categoria && <span className="text-error text-sm">{errors.categoria.message}</span>}
                                </div>
                            )}
                        />

                        <Controller
                            name="imagen"
                            control={control}
                            rules={{ required: "La imagen es obligatoria" }}
                            render={({ field }) => (
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Imagen</span>
                                    </label>
                                    <input
                                        type="file"
                                        onChange={(e) => field.onChange(e.target.files)}
                                        className="file-input file-input-bordered w-full"
                                    />
                                    {errors.imagen && <span className="text-error text-sm">{errors.imagen.message}</span>}
                                </div>
                            )}
                        />

                        <div className="modal-action">
                            <button type="button" className="btn" onClick={() => setIsOpen(false)}>Cerrar</button>
                            <button type="submit" className={`btn btn-primary ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                                Crear
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    )
}

export default CrearProducto;