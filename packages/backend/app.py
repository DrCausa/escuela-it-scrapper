from flask import Flask
from flask_cors import CORS
from routes.data import data_pb
from routes.transcripts import transcripts_bp
from routes.videos import videos_bp
from routes.utils import utils_bp


app = Flask(__name__)


CORS(app)


app.register_blueprint(data_pb)
app.register_blueprint(transcripts_bp)
app.register_blueprint(videos_bp)
app.register_blueprint(utils_bp)


if __name__ == "__main__":
  app.run(debug=True, port=5000)