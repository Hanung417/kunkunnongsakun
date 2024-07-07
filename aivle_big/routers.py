class SchemaRouter:
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'community':
            return 'default'  # Use the default database
        if model._meta.app_label == 'login':
            return 'default'  # Use the default database
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'community':
            return 'default'  # Use the default database
        if model._meta.app_label == 'login':
            return 'default'  # Use the default database
        return None

    def allow_relation(self, obj1, obj2, **hints):
        if obj1._meta.app_label in {'community', 'login'} and obj2._meta.app_label in {'community', 'login'}:
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == 'community':
            return db == 'default'  # Use the default database
        if app_label == 'login':
            return db == 'default'  # Use the default database
        return None
