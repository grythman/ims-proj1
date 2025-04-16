import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../../services/api';

const InternshipList = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchInternships();
    }, []);

    const fetchInternships = async () => {
        try {
            const response = await api.get('/api/v1/internships/');
            setInternships(response.data);
        } catch (err) {
            setError('Дадлагын мэдээлэл ачаалахад алдаа гарлаа');
            console.error('Error fetching internships:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Дадлагын жагсаалт</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                    {internships.map(internship => (
                        <div key={internship.id} className="bg-white p-4 rounded-lg shadow">
                            <h2 className="text-xl font-semibold">{internship.title}</h2>
                            <p className="text-gray-600">{internship.description}</p>
                            <div className="mt-2">
                                <span className="text-sm text-gray-500">
                                    {internship.start_date} - {internship.end_date}
                                </span>
                            </div>
                            <div className="mt-2">
                                <span className="text-sm text-gray-500">
                                    {internship.address}, {internship.city}, {internship.country}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="h-[500px] rounded-lg overflow-hidden">
                    <MapContainer 
                        center={[47.9212, 106.9186]} // Ulaanbaatar coordinates
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {internships.map(internship => (
                            internship.location && (
                                <Marker
                                    key={internship.id}
                                    position={[internship.location.y, internship.location.x]}
                                >
                                    <Popup>
                                        <div>
                                            <h3 className="font-bold">{internship.title}</h3>
                                            <p>{internship.address}</p>
                                            <p>{internship.employer?.organization_name}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            )
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default InternshipList; 