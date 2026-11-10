// =====================================================
// KONFIGURASI MQTT
// =====================================================

const MQTT_BROKER =
    "ws://broker.hivemq.com:8000/mqtt";


// =====================================================
// TOPIC
// =====================================================

const TOPIC_SUHU =
    "deteksi_kebakaran_dini/monitoring/suhu";

const TOPIC_KELEMBAPAN =
    "deteksi_kebakaran_dini/monitoring/kelembapan";

const TOPIC_ASAP =
    "deteksi_kebakaran_dini/monitoring/asap";

const TOPIC_API =
    "deteksi_kebakaran_dini/monitoring/api";

const TOPIC_STATUS =
    "deteksi_kebakaran_dini/status/alarm";

const TOPIC_AKTUATOR =
    "deteksi_kebakaran_dini/status/aktuator";


// =====================================================
// ELEMENT HTML
// =====================================================

const connectionStatus =
    document.getElementById(
        "connectionStatus"
    );

const systemStatus =
    document.getElementById(
        "systemStatus"
    );

const statusIcon =
    document.getElementById(
        "statusIcon"
    );

const temperature =
    document.getElementById(
        "temperature"
    );

const humidity =
    document.getElementById(
        "humidity"
    );

const smoke =
    document.getElementById(
        "smoke"
    );

const fireStatus =
    document.getElementById(
        "fireStatus"
    );

const actuatorStatus =
    document.getElementById(
        "actuatorStatus"
    );

const greenLed =
    document.getElementById(
        "greenLed"
    );

const redLed =
    document.getElementById(
        "redLed"
    );

const buzzerStatus =
    document.getElementById(
        "buzzerStatus"
    );

const lastUpdate =
    document.getElementById(
        "lastUpdate"
    );

const logElement =
    document.getElementById(
        "log"
    );


// =====================================================
// CONNECT MQTT
// =====================================================

console.log(
    "Menghubungkan MQTT..."
);

const client =
    mqtt.connect(
        MQTT_BROKER
    );


// =====================================================
// MQTT CONNECT
// =====================================================

client.on(
    "connect",
    function () {

        console.log(
            "MQTT connected"
        );


        connectionStatus.textContent =
            "MQTT CONNECTED";

        connectionStatus.className =
            "connection connected";


        addLog(
            "MQTT berhasil terhubung."
        );


        // Subscribe semua topic
        client.subscribe(
            "deteksi_kebakaran_dini/#",
            function (error) {

                if (error) {

                    addLog(
                        "Gagal subscribe MQTT."
                    );

                }

                else {

                    addLog(
                        "Berhasil subscribe topic."
                    );
                }
            }
        );
    }
);


// =====================================================
// MQTT ERROR
// =====================================================

client.on(
    "error",
    function (error) {

        console.error(
            error
        );

        addLog(
            "MQTT ERROR: " +
            error.message
        );
    }
);


// =====================================================
// MQTT OFFLINE
// =====================================================

client.on(
    "offline",
    function () {

        connectionStatus.textContent =
            "MQTT OFFLINE";

        connectionStatus.className =
            "connection disconnected";

        addLog(
            "MQTT offline."
        );
    }
);


// =====================================================
// RECEIVE MESSAGE
// =====================================================

client.on(
    "message",
    function (
        topic,
        message
    ) {

        const value =
            message.toString();


        console.log(
            topic,
            value
        );


        updateTime();


        // ---------------------------------------------
        // SUHU
        // ---------------------------------------------

        if (
            topic === TOPIC_SUHU
        ) {

            const valueNumber =
                parseFloat(
                    value
                );

            temperature.textContent =
                valueNumber.toFixed(1);

            updateTemperatureBar(
                valueNumber
            );
        }


        // ---------------------------------------------
        // KELEMBAPAN
        // ---------------------------------------------

        else if (
            topic ===
            TOPIC_KELEMBAPAN
        ) {

            const valueNumber =
                parseFloat(
                    value
                );

            humidity.textContent =
                valueNumber.toFixed(1);

            updateHumidityBar(
                valueNumber
            );
        }


        // ---------------------------------------------
        // ASAP
        // ---------------------------------------------

        else if (
            topic === TOPIC_ASAP
        ) {

            const valueNumber =
                parseInt(
                    value
                );

            smoke.textContent =
                valueNumber;

            updateSmokeBar(
                valueNumber
            );
        }


        // ---------------------------------------------
        // API
        // ---------------------------------------------

        else if (
            topic === TOPIC_API
        ) {

            if (
                value ===
                "TERDETEKSI"
            ) {

                fireStatus.textContent =
                    "🔥 API TERDETEKSI";

                fireStatus.style.background =
                    "#fee2e2";

                fireStatus.style.color =
                    "#991b1b";

            }

            else {

                fireStatus.textContent =
                    "✓ TIDAK TERDETEKSI";

                fireStatus.style.background =
                    "#dcfce7";

                fireStatus.style.color =
                    "#166534";
            }
        }


        // ---------------------------------------------
        // STATUS
        // ---------------------------------------------

        else if (
            topic ===
            TOPIC_STATUS
        ) {

            updateSystemStatus(
                value
            );
        }


        // ---------------------------------------------
        // AKTUATOR
        // ---------------------------------------------

        else if (
            topic ===
            TOPIC_AKTUATOR
        ) {

            updateActuator(
                value
            );
        }
    }
);


// =====================================================
// UPDATE STATUS SISTEM
// =====================================================

function updateSystemStatus(
    status
) {

    if (
        status === "BAHAYA"
    ) {

        systemStatus.textContent =
            "⚠️ BAHAYA";

        systemStatus.style.color =
            "#b91c1c";

        statusIcon.textContent =
            "🔥";

        statusIcon.style.background =
            "#fee2e2";

        addLog(
            "PERINGATAN: Kondisi BAHAYA."
        );

    }

    else if (
        status === "AMAN"
    ) {

        systemStatus.textContent =
            "✓ AMAN";

        systemStatus.style.color =
            "#166534";

        statusIcon.textContent =
            "✓";

        statusIcon.style.background =
            "#dcfce7";

        addLog(
            "Kondisi sistem AMAN."
        );
    }
}


// =====================================================
// UPDATE AKTUATOR
// =====================================================

function updateActuator(
    status
) {

    if (
        status === "ON"
    ) {

        actuatorStatus.textContent =
            "ON";

        actuatorStatus.style.color =
            "#b91c1c";

        redLed.textContent =
            "ON";

        redLed.style.color =
            "#dc2626";

        greenLed.textContent =
            "OFF";

        greenLed.style.color =
            "#6b7280";

        buzzerStatus.textContent =
            "ON";

        buzzerStatus.style.color =
            "#dc2626";

    }

    else {

        actuatorStatus.textContent =
            "OFF";

        actuatorStatus.style.color =
            "#166534";

        redLed.textContent =
            "OFF";

        redLed.style.color =
            "#6b7280";

        greenLed.textContent =
            "ON";

        greenLed.style.color =
            "#16a34a";

        buzzerStatus.textContent =
            "OFF";

        buzzerStatus.style.color =
            "#6b7280";
    }
}


// =====================================================
// TEMPERATURE BAR
// =====================================================

function updateTemperatureBar(
    value
) {

    let percentage =
        (value / 60) *
        100;

    percentage =
        Math.max(
            0,
            Math.min(
                percentage,
                100
            )
        );

    document.getElementById(
        "temperatureBar"
    ).style.width =
        percentage + "%";
}


// =====================================================
// HUMIDITY BAR
// =====================================================

function updateHumidityBar(
    value
) {

    let percentage =
        Math.max(
            0,
            Math.min(
                value,
                100
            )
        );

    document.getElementById(
        "humidityBar"
    ).style.width =
        percentage + "%";
}


// =====================================================
// SMOKE BAR
// =====================================================

function updateSmokeBar(
    value
) {

    let percentage =
        (value / 4095) *
        100;

    percentage =
        Math.max(
            0,
            Math.min(
                percentage,
                100
            )
        );

    document.getElementById(
        "smokeBar"
    ).style.width =
        percentage + "%";
}


// =====================================================
// WAKTU UPDATE
// =====================================================

function updateTime() {

    const now =
        new Date();

    lastUpdate.textContent =
        "Update: " +
        now.toLocaleTimeString(
            "id-ID"
        );
}


// =====================================================
// LOG
// =====================================================

function addLog(
    message
) {

    const time =
        new Date()
        .toLocaleTimeString(
            "id-ID"
        );


    const line =
        `[${time}] ${message}`;


    if (
        logElement.textContent.includes(
            "Dashboard sedang menunggu"
        )
    ) {

        logElement.textContent =
            "";
    }


    logElement.textContent +=
        line + "\n";


    // batasi log
    const lines =
        logElement.textContent
        .split("\n");


    if (
        lines.length > 12
    ) {

        logElement.textContent =
            lines
            .slice(-12)
            .join("\n");
    }
}