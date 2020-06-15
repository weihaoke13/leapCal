from flask import Flask

def create_app():
    app = Flask(__name__, instance_relative_config = False)

    with app.app_context():
        from .users_login    import login_routes
        from .users_register import register_routes
        from .users_events   import user_events
        from .events_delete  import events_delete_route
        from .events_signup  import events_signup_route
        from .events_create  import events_create_route
        from .events_edit    import events_edit_route
        from .events_retrieve_users import events_retrieve_users_for_event
        from .events_retrieval import events_retrieval


        app.register_blueprint(login_routes.login_routes_bp)
        app.register_blueprint(register_routes.user_register_routes_bp)
        app.register_blueprint(user_events.user_events_retrieval_bp)
        app.register_blueprint(events_delete_route.delete_event_bp)
        app.register_blueprint(events_signup_route.events_signup_bp)
        app.register_blueprint(events_create_route.events_create_bp)
        app.register_blueprint(events_edit_route.events_edit_bp)
        app.register_blueprint(events_retrieve_users_for_event.events_retrieve_users_bp)
        app.register_blueprint(events_retrieval.events_retrieval_bp)

        return app