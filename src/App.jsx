import { useState, useEffect, useCallback } from "react";

/* ---------------------------------------------------------------
   DESIGN TOKENS
--------------------------------------------------------------- */
const palette = {
  light: {
    bg: "#FAF7F2",
    bgAlt: "#F1ECE3",
    card: "#FFFFFF",
    text: "#3E3A36",
    textSoft: "#6B6459",
    sage: "#8FA487",
    sageSoft: "#DCE5D6",
    blue: "#8FA3B3",
    blueSoft: "#DEE7EC",
    terracotta: "#C98868",
    terracottaSoft: "#F1DFD4",
    stone: "#8C8577",
    stoneSoft: "#E7E3DB",
    border: "#E7E0D5",
  },
  dark: {
    bg: "#26241F",
    bgAlt: "#302D27",
    card: "#332F29",
    text: "#EFEAE1",
    textSoft: "#B7AF9F",
    sage: "#9CB393",
    sageSoft: "#3C4438",
    blue: "#9DB2C1",
    blueSoft: "#37424A",
    terracotta: "#D69B7C",
    terracottaSoft: "#4A3A30",
    stone: "#A69F90",
    stoneSoft: "#3E3A33",
    border: "#454037",
  },
};

const fontDisplay =
  '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif';
const fontBody =
  '-apple-system, "Segoe UI", "Figtree", "Helvetica Neue", Arial, sans-serif';

/* ---------------------------------------------------------------
   CONTENU — Bibliothèque clinique d'exercices
   Chaque exercice est indexé selon plusieurs portes d'entrée :
   état du système nerveux, besoin, réponse de protection, canal
   sensoriel/cognitif, durée. "sensible" liste les dimensions à
   exclure si l'utilisateur les a indiquées comme à éviter.
--------------------------------------------------------------- */
const ETATS_LIST = [
  { id: "hyperactivation", label: "Hyperactivation", color: "terracotta" },
  { id: "hypoactivation", label: "Hypoactivation", color: "blue" },
  { id: "tolerance", label: "Zone de tolérance", color: "sage" },
  { id: "mixte", label: "État mixte", color: "stone" },
  { id: "dissociation", label: "Dissocié·e / irréel·le / loin", color: "stone" },
];

const BESOINS_LIST = [
  { id: "orienter", label: "M'orienter vers le présent" },
  { id: "appuis", label: "Sentir mes appuis" },
  { id: "contenir", label: "Contenir ce qui déborde" },
  { id: "mobiliser_fight", label: "Mobiliser mon énergie sans me faire mal" },
  { id: "mobiliser_flight", label: "Répondre à une envie de fuite" },
  { id: "mouvement", label: "Retrouver un peu de mouvement" },
  { id: "sens", label: "Réveiller mes sens en douceur" },
  { id: "choix", label: "Retrouver du choix" },
  { id: "dissocie", label: "Revenir quand je me sens loin" },
  { id: "limites", label: "Retrouver mes limites" },
  { id: "corps", label: "Revenir à mon corps" },
  { id: "mental", label: "Prendre de la distance avec mes pensées" },
  { id: "douceur", label: "Un peu de douceur envers moi" },
  { id: "lien", label: "Être moins seul·e" },
  { id: "lieu_ressource", label: "Un lieu ressource" },
  { id: "tolerance_renforcer", label: "Mieux me connaître" },
];

const CANAUX_LIST = [
  { id: "visuel", label: "Visuel" },
  { id: "auditif", label: "Auditif" },
  { id: "tactile", label: "Tactile" },
  { id: "moteur", label: "Mouvement" },
  { id: "cognitif", label: "Réfléchir / écrire" },
  { id: "imaginatif", label: "Imagination" },
  { id: "relationnel", label: "Lien avec quelqu'un" },
];

const DUREE_LIST = [
  { id: "30s", label: "30 secondes" },
  { id: "2min", label: "2 minutes" },
  { id: "5min", label: "5 minutes" },
  { id: "10min", label: "10 minutes ou plus" },
];

const EVITER_LIST = [
  { id: "yeux_fermes", label: "Fermer les yeux" },
  { id: "respiration", label: "Me concentrer sur ma respiration" },
  { id: "interoception", label: "Sentir l'intérieur de mon corps" },
  { id: "imagination", label: "Imaginer un lieu" },
  { id: "immobilite", label: "Être immobile" },
  { id: "mouvement", label: "Bouger" },
  { id: "toucher_corps", label: "Toucher mon corps" },
  { id: "ecrire", label: "Écrire" },
];

const REMARQUE_OPTIONS = [
  "Un peu plus présent·e", "Un peu plus stable", "Un peu plus d'énergie",
  "Un peu moins d'énergie", "Aucun changement", "C'est plus inconfortable", "Autre chose",
];

const FEEDBACK_OPTIONS = ["Beaucoup", "Un peu", "Cela dépend", "Pas vraiment", "Je préfère l'éviter"];

const EXERCISES = [
  { id: "regard-explore", titre: "Le regard qui explore", etats: ["hyperactivation", "mixte"], besoins: ["orienter"], protection: [], canaux: ["visuel"], duree: "2min", materiel: null,
    objectif: "Aider l'attention à sortir progressivement du tunnel de la menace et à reprendre contact avec l'environnement actuel.",
    etapes: ["Vous n'avez pas besoin de fermer les yeux.", "Laissez votre regard aller doucement autour de vous, sans chercher quelque chose de précis.", "Regardez d'abord ce qui est devant vous, puis un peu à droite, puis un peu à gauche.", "Remarquez une couleur, une forme, un objet familier — quelque chose qui n'est pas menaçant.", "Vous n'avez pas besoin de vous sentir calme : il s'agit seulement de laisser vos yeux vérifier où vous êtes maintenant."],
    precaution: null, sensible: [] },
  { id: "ou-suis-je", titre: "Où suis-je maintenant ?", etats: ["hyperactivation", "mixte", "dissociation"], besoins: ["orienter"], protection: [], canaux: ["cognitif", "visuel"], duree: "2min", materiel: null,
    objectif: "Soutenir la réorientation lorsque vous vous sentez submergé·e, confus·e ou « reparti·e ailleurs ».",
    etapes: ["Regardez autour de vous et complétez ce que vous pouvez : « Je suis à… », « Nous sommes… », « Il est environ… », « Autour de moi, je vois… », « La prochaine chose que je vais faire est… »", "Vous n'avez pas besoin de compléter toutes les phrases.", "Vous pouvez aussi simplement les lire sans y répondre, si répondre est trop difficile."],
    precaution: null, sensible: [] },
  { id: "preuves-present", titre: "Les preuves du présent", etats: ["hyperactivation", "dissociation"], besoins: ["orienter"], protection: [], canaux: ["cognitif", "visuel"], duree: "2min", materiel: null,
    objectif: "Aider lorsque quelque chose du passé semble envahir le présent.",
    etapes: ["Cherchez trois éléments qui appartiennent clairement à aujourd'hui : votre téléphone, un objet récent, votre âge actuel, la date, le lieu où vous vivez maintenant, une personne qui fait partie de votre vie aujourd'hui.", "Complétez : « Ce qui se passe dans mon corps peut être très intense. Et en même temps, aujourd'hui… » — ajoutez une seule information du présent, par exemple « je suis dans mon salon »."],
    precaution: "Cet exercice ne vise pas à affirmer « je suis en sécurité » à votre place, mais à remarquer ce qui, ici et maintenant, est différent d'avant.", sensible: [] },
  { id: "trois-choses-stables", titre: "Trois choses stables", etats: ["hyperactivation", "mixte"], besoins: ["orienter"], protection: [], canaux: ["visuel"], duree: "30s", materiel: null,
    objectif: "Créer des repères visuels quand tout semble chaotique.",
    etapes: ["Choisissez trois éléments immobiles autour de vous.", "Regardez le premier, puis le deuxième, puis le troisième, puis revenez au premier.", "Observez simplement leurs contours, à votre rythme."],
    precaution: null, sensible: [] },
  { id: "sentir-support", titre: "Sentir le support", etats: ["hyperactivation"], besoins: ["appuis"], protection: [], canaux: ["tactile"], duree: "30s", materiel: null,
    objectif: "Diriger l'attention vers les zones de votre corps soutenues par l'environnement.",
    etapes: ["Sans chercher à sentir tout votre corps, remarquez seulement ce qui est soutenu : vos pieds par le sol, vos jambes par le fauteuil, votre dos par le dossier.", "Choisissez une seule zone. Vous n'avez pas besoin de la modifier.", "Demandez-vous simplement : « Qu'est-ce qui me porte à cet endroit précis ? »"],
    precaution: null, sensible: ["toucher_corps"] },
  { id: "pousser-le-sol", titre: "Pousser le sol", etats: ["hyperactivation"], besoins: ["appuis", "mobiliser_fight"], protection: [], canaux: ["moteur"], duree: "30s", materiel: null,
    objectif: "Créer un appui et donner une direction à une énergie de mobilisation.",
    etapes: ["Posez les pieds au sol si cela vous est possible.", "Appuyez doucement, comme pour éloigner le sol de vous — pas au maximum, juste assez pour sentir vos jambes travailler.", "Maintenez quelques secondes, puis diminuez progressivement la pression."],
    precaution: null, sensible: ["mouvement"] },
  { id: "poids-mains", titre: "Le poids dans les mains", etats: ["hyperactivation"], besoins: ["appuis"], protection: [], canaux: ["tactile"], duree: "2min", materiel: "Un objet avec un peu de poids (coussin, livre, bouteille d'eau).",
    objectif: "Utiliser le poids et la résistance comme information sensorielle stable.",
    etapes: ["Prenez un objet qui a un peu de poids.", "Sentez son poids dans vos mains : où vos doigts le tiennent, quels muscles travaillent.", "Vous pouvez le déplacer doucement d'une main à l'autre."],
    precaution: null, sensible: [] },
  { id: "le-contenant", titre: "Le contenant", etats: ["hyperactivation", "mixte"], besoins: ["contenir"], protection: [], canaux: ["imaginatif", "cognitif"], duree: "5min", materiel: "Optionnel : une feuille et un stylo pour la version concrète.",
    objectif: "Donner temporairement une place à une pensée, une image ou une préoccupation qui prend toute la place — sans la supprimer ni la nier.",
    etapes: ["Si l'imagination vous convient aujourd'hui : imaginez un contenant adapté (boîte, coffre, armoire…). Décidez sa taille, sa matière, s'il a un verrou, qui peut l'ouvrir, où il se trouve.", "Donnez à ce qui vous préoccupe une forme symbolique — un mot, une couleur, un objet — sans avoir besoin de le raconter en détail. Déposez cette représentation dans le contenant, puis fermez-le.", "Si l'imagination ne vous convient pas : écrivez seulement quelques mots sur une feuille, pliez-la, placez-la dans une enveloppe ou un tiroir, avec par exemple « pas maintenant » ou « à reprendre avec… ».", "Vous pourrez décider plus tard de le rouvrir, seul·e ou avec votre thérapeute."],
    precaution: "Cet exercice ne demande jamais de détailler un contenu traumatique. Il ne s'agit pas d'enfermer définitivement une émotion, seulement de lui donner une place pour plus tard.", sensible: ["imagination", "ecrire"] },
  { id: "parking-pensees", titre: "Le parking à pensées", etats: ["hyperactivation", "tolerance"], besoins: ["contenir", "mental"], protection: [], canaux: ["cognitif"], duree: "2min", materiel: null,
    objectif: "Pour les pensées répétitives, les tâches ou les inquiétudes qui tournent en boucle.",
    etapes: ["Créez trois espaces : « à faire maintenant », « à reprendre plus tard », « je ne peux pas agir dessus aujourd'hui ».", "Placez une seule préoccupation dans l'une de ces catégories.", "Vous n'avez pas besoin d'organiser toute votre vie — une seule chose suffit."],
    precaution: null, sensible: [] },
  { id: "bords-du-corps", titre: "Les bords du corps", etats: ["hyperactivation"], besoins: ["contenir", "corps"], protection: [], canaux: ["tactile"], duree: "30s", materiel: null,
    objectif: "Retrouver une sensation de limites corporelles lorsque l'émotion paraît prendre toute la place.",
    etapes: ["Choisissez une zone neutre ou suffisamment tolérable : les mains, les avant-bras, les pieds, les épaules.", "Frottez doucement le tissu de votre vêtement, ou pressez vos mains l'une contre l'autre.", "Remarquez simplement : « ici, il y a un bord. » Vous n'avez pas besoin de sentir tout votre corps."],
    precaution: null, sensible: ["toucher_corps"] },
  { id: "pousser-mur", titre: "Pousser le mur", etats: ["hyperactivation"], besoins: ["mobiliser_fight"], protection: ["fight"], canaux: ["moteur"], duree: "2min", materiel: null,
    objectif: "Donner à l'énergie de lutte une action contenue et contrôlée.",
    etapes: ["Vérifiez d'abord que le mur est stable et que votre corps vous permet cet exercice.", "Placez les mains contre le mur. Choisissez vous-même la force.", "Poussez quelques secondes, sentez la résistance, puis diminuez progressivement. Vous pouvez recommencer une ou deux fois."],
    precaution: null, sensible: ["mouvement"] },
  { id: "tordre-tissu", titre: "Tordre sans détruire", etats: ["hyperactivation"], besoins: ["mobiliser_fight"], protection: ["fight"], canaux: ["moteur", "tactile"], duree: "2min", materiel: "Une serviette ou un tissu solide.",
    objectif: "Donner une action contenue à une énergie de colère, sans escalade.",
    etapes: ["Tenez le tissu entre vos mains et tordez-le progressivement, en choisissant vous-même la force.", "Diminuez lentement. Vous pouvez recommencer."],
    precaution: "Vous restez à tout moment celui ou celle qui décide de l'intensité — le but n'est pas d'augmenter la force à chaque fois.", sensible: [] },
  { id: "ce-que-je-protege", titre: "Ce que je protège", etats: ["hyperactivation"], besoins: ["mobiliser_fight", "mental"], protection: ["fight"], canaux: ["cognitif"], duree: "2min", materiel: null,
    objectif: "Donner du sens à la colère, sans obliger à agir dans l'immédiat.",
    etapes: ["Complétez : « Si ma colère essaie de protéger quelque chose, peut-être qu'elle protège… » (une limite, mon intégrité, quelqu'un, je ne sais pas…).", "Puis : « Quelle est la plus petite action protectrice possible qui ne me mette pas en danger ? »"],
    precaution: null, sensible: [] },
  { id: "marcher-destination", titre: "Marcher avec une destination", etats: ["hyperactivation"], besoins: ["mobiliser_flight"], protection: ["flight"], canaux: ["moteur"], duree: "2min", materiel: null,
    objectif: "Donner une direction à une énergie de fuite.",
    etapes: ["Choisissez un point visible et accessible. Marchez jusqu'à ce point, arrêtez-vous, regardez autour de vous.", "Choisissez ensuite de rester là, de revenir, ou de choisir un autre point. Vous gardez la direction du mouvement."],
    precaution: null, sensible: ["mouvement"] },
  { id: "urgent-ou-intense", titre: "Urgent ou intense ?", etats: ["hyperactivation"], besoins: ["mobiliser_flight", "mental"], protection: ["flight"], canaux: ["cognitif"], duree: "2min", materiel: null,
    objectif: "Différencier l'intensité ressentie dans le corps d'une urgence réellement extérieure.",
    etapes: ["Posez-vous ces trois questions : Y a-t-il un danger concret immédiat ? Une action doit-elle vraiment être faite dans les prochaines minutes ? Puis-je attendre cinq minutes avant de décider ?", "Si vous ne savez pas, vous pouvez demander l'avis d'une personne de confiance."],
    precaution: null, sensible: [] },
  { id: "plus-petit-mouvement", titre: "Le plus petit mouvement possible", etats: ["hypoactivation", "mixte"], besoins: ["mouvement"], protection: ["freeze"], canaux: ["moteur"], duree: "30s", materiel: null,
    objectif: "Rendre l'action accessible lorsqu'un mouvement complet semble impossible.",
    etapes: ["Choisissez le plus petit mouvement possible : bouger un doigt, décoller légèrement un talon, tourner les yeux.", "Faites ce mouvement une seule fois, puis choisissez : le refaire, en essayer un autre, ou arrêter."],
    precaution: null, sensible: ["mouvement"] },
  { id: "pousser-revenir", titre: "Pousser et revenir", etats: ["hypoactivation"], besoins: ["mouvement"], protection: [], canaux: ["moteur"], duree: "30s", materiel: null,
    objectif: "Réintroduire un mouvement simple, alterné et prévisible.",
    etapes: ["Appuyez légèrement un pied contre le sol, puis l'autre.", "Alternez à votre rythme : gauche, droite, gauche, droite."],
    precaution: null, sensible: ["mouvement"] },
  { id: "mouvements-grandissent", titre: "Les mouvements qui grandissent", etats: ["hypoactivation"], besoins: ["mouvement"], protection: [], canaux: ["moteur"], duree: "2min", materiel: null,
    objectif: "Laisser un mouvement minuscule s'agrandir progressivement, à votre rythme.",
    etapes: ["Commencez avec un mouvement minuscule, par exemple bouger les doigts.", "Si cela reste acceptable, laissez le mouvement s'agrandir un peu : les mains, puis les poignets, puis peut-être les bras.", "Vous pouvez vous arrêter à n'importe quelle étape."],
    precaution: null, sensible: ["mouvement"] },
  { id: "chercher-couleur", titre: "Chercher une couleur", etats: ["hypoactivation"], besoins: ["sens"], protection: [], canaux: ["visuel"], duree: "30s", materiel: null,
    objectif: "Stimuler doucement l'attention par la recherche visuelle.",
    etapes: ["Choisissez une couleur et cherchez un objet de cette couleur, puis un deuxième.", "Variante plus activante : cherchez quelque chose de rouge, quelque chose qui brille, quelque chose avec des lettres, quelque chose qui bouge."],
    precaution: null, sensible: [] },
  { id: "contraste-sensoriel", titre: "Contraste sensoriel", etats: ["hypoactivation"], besoins: ["sens"], protection: [], canaux: ["tactile"], duree: "2min", materiel: null,
    objectif: "Créer une information sensorielle claire pour réveiller doucement l'attention.",
    etapes: ["Choisissez deux sensations différentes : lisse / rugueux, léger / lourd, frais / tiède.", "Touchez le premier objet, puis le second. Remarquez simplement : « c'est différent. »"],
    precaution: "Pas de froid extrême, pas de douleur, pas de stimulation brutale.", sensible: [] },
  { id: "voix-qui-revient", titre: "La voix qui revient", etats: ["hypoactivation"], besoins: ["sens"], protection: [], canaux: ["auditif"], duree: "2min", materiel: null,
    objectif: "Réintroduire progressivement la voix et le son, à votre rythme.",
    etapes: ["Choisissez un niveau : expirer avec un son très léger ; fredonner une note ; dire votre prénom ; lire une phrase à voix haute.", "Vous choisissez le niveau qui vous convient aujourd'hui — rien n'est obligatoire au-delà."],
    precaution: null, sensible: ["respiration"] },
  { id: "choisir-entre-deux", titre: "Choisir entre deux", etats: ["hypoactivation"], besoins: ["choix"], protection: ["freeze"], canaux: ["cognitif"], duree: "30s", materiel: null,
    objectif: "Restaurer une capacité de décision lorsque tout semble inaccessible.",
    etapes: ["Choisissez seulement entre deux possibilités très simples : rester assis·e ou vous lever ? boire quelque chose ou attendre ? continuer ou arrêter ?", "Un petit choix est déjà un choix."],
    precaution: null, sensible: [] },
  { id: "prochaine-action", titre: "La prochaine action minuscule", etats: ["hypoactivation"], besoins: ["choix"], protection: [], canaux: ["cognitif"], duree: "30s", materiel: null,
    objectif: "Se concentrer sur une seule action accessible, plutôt que sur tout ce qu'il y aurait à faire.",
    etapes: ["Ne pensez pas à toute la journée. Quelle est seulement la prochaine action ? (poser les pieds au sol, prendre mon téléphone, boire une gorgée…)", "Vous pouvez créer votre propre micro-action."],
    precaution: null, sensible: [] },
  { id: "carte-identite", titre: "La carte d'identité du présent", etats: ["dissociation"], besoins: ["dissocie", "orienter"], protection: [], canaux: ["cognitif"], duree: "2min", materiel: null,
    objectif: "Revenir vers des repères simples quand vous vous sentez loin, absent·e, ou hors du temps.",
    etapes: ["Complétez ou relisez si vous les avez déjà préparées : « Je m'appelle… », « J'ai … ans », « Nous sommes en… », « Je suis actuellement à… », « La personne que je peux contacter est… », « Après cet exercice, je vais… »", "Vous pouvez préparer ces informations à l'avance, quand vous allez bien, pour vous les réafficher plus facilement dans un moment difficile."],
    precaution: null, sensible: [] },
  { id: "ce-qui-a-change", titre: "Ce qui a changé depuis", etats: ["dissociation"], besoins: ["dissocie"], protection: [], canaux: ["cognitif"], duree: "2min", materiel: null,
    objectif: "Soutenir la distinction entre le passé et le présent.",
    etapes: ["Cherchez un élément qui montre que le temps a passé : votre âge, votre téléphone, votre logement, une personne présente aujourd'hui.", "Terminez la phrase : « Aujourd'hui, une chose est différente : … »"],
    precaution: null, sensible: [] },
  { id: "decrire-objet", titre: "Décrire un objet à quelqu'un", etats: ["dissociation"], besoins: ["dissocie", "sens"], protection: [], canaux: ["visuel", "cognitif"], duree: "2min", materiel: null,
    objectif: "Ancrer l'attention dans une tâche concrète et neutre.",
    etapes: ["Choisissez un objet. Imaginez que vous devez le décrire à quelqu'un qui ne peut pas le voir : sa couleur, sa forme, sa taille, sa matière, son usage.", "Vous n'avez pas besoin de parler de ce que vous ressentez."],
    precaution: null, sensible: [] },
  { id: "couverture-enveloppement", titre: "La couverture ou l'enveloppement", etats: ["hyperactivation", "dissociation"], besoins: ["contenir"], protection: [], canaux: ["tactile"], duree: "2min", materiel: "Une couverture, un plaid, un coussin ou un vêtement enveloppant.",
    objectif: "Utiliser la pression et l'enveloppement comme repère de contenance, si cela vous convient.",
    etapes: ["Si la pression ou l'enveloppement vous conviennent, choisissez vous-même la zone couverte, la pression et la durée.", "Demandez-vous régulièrement : plus ? moins ? pareil ? stop ?"],
    precaution: null, sensible: ["toucher_corps"] },
  { id: "mains-rencontrent", titre: "Les mains qui se rencontrent", etats: ["hyperactivation"], besoins: ["contenir"], protection: [], canaux: ["tactile"], duree: "30s", materiel: null,
    objectif: "Retrouver une sensation de limite et de résistance, avec vos propres mains.",
    etapes: ["Placez vos paumes l'une contre l'autre. Laissez une main pousser légèrement l'autre, puis laissez l'autre répondre.", "Vous choisissez la force. Remarquez : « il y a une limite, il y a une résistance. »"],
    precaution: null, sensible: ["toucher_corps"] },
  { id: "dossier-a-reprendre", titre: "Le dossier à reprendre", etats: ["hyperactivation", "tolerance"], besoins: ["contenir"], protection: [], canaux: ["cognitif"], duree: "2min", materiel: null,
    objectif: "Mettre de côté une pensée ou un souvenir sans que cela signifie l'abandonner ou le nier.",
    etapes: ["Notez : « Ce que je mets de côté… », « Je souhaite y revenir : seul·e / avec mon thérapeute / avec une personne de confiance / plus tard », et éventuellement une date pour y revenir."],
    precaution: null, sensible: [] },
  { id: "lieu-ressource", titre: "Construire un lieu ressource", etats: ["tolerance", "hyperactivation"], besoins: ["lieu_ressource"], protection: [], canaux: ["imaginatif"], duree: "10min", materiel: null,
    objectif: "Construire progressivement un lieu ressource — réel, imaginaire, ou inspiré de plusieurs endroits — sur lequel vous gardez le contrôle.",
    etapes: ["Vérifiez d'abord si l'imagination vous convient aujourd'hui. Si non, vous pouvez partir d'une photo, d'un lieu réel ou d'un objet.", "Pensez à un endroit où vous vous sentez un peu plus tranquille ou simplement moins en difficulté. Il n'a pas besoin d'être parfait.", "Décidez qui peut y entrer, à quelle distance se trouvent les autres, s'il y a une porte, une limite, une lumière, un abri.", "Vous pouvez garder les yeux ouverts. Remarquez une seule chose concernant cet endroit, puis une deuxième seulement si vous le souhaitez.", "Remarquez l'effet : un peu plus d'espace ? rien de particulier ? de l'inconfort ? Si c'est inconfortable, vous pouvez arrêter et revenir à l'orientation externe.", "Si cela vous convient, associez ce lieu à une image, un mot, un geste ou un objet, pour pouvoir y revenir plus facilement."],
    precaution: "Ce lieu n'a pas besoin d'être un « lieu sûr » parfait — certaines personnes ne trouvent aucun lieu entièrement sûr, et c'est tout à fait normal. Si l'exercice augmente la détresse ou la dissociation, mieux vaut s'arrêter et choisir un exercice plus concret.", sensible: ["imagination", "yeux_fermes"] },
  { id: "oui-non-jns", titre: "Mon oui, mon non, mon je ne sais pas", etats: ["tolerance", "hyperactivation"], besoins: ["limites"], protection: ["fawn"], canaux: ["cognitif", "relationnel"], duree: "2min", materiel: null,
    objectif: "Entraîner le repérage de vos propres oui, non, et « je ne sais pas encore ».",
    etapes: ["Entraînez-vous sur des situations très simples et neutres : boire de l'eau maintenant ? continuer cet exercice ?", "Pour la situation qui vous préoccupe : votre réponse est-elle plutôt oui, non, ou je ne sais pas encore ?", "« Je ne sais pas encore » est une réponse tout aussi valable que les autres."],
    precaution: null, sensible: [] },
  { id: "phrase-temps", titre: "La phrase qui crée du temps", etats: ["tolerance", "hyperactivation"], besoins: ["limites"], protection: ["fawn"], canaux: ["relationnel", "cognitif"], duree: "30s", materiel: null,
    objectif: "Se donner un peu de temps avant de répondre à quelqu'un.",
    etapes: ["Choisissez ou enregistrez en favori une phrase : « J'ai besoin d'y réfléchir. », « Je ne peux pas répondre maintenant. », « Je préfère arrêter cette conversation pour l'instant. »", "Vous pouvez aussi créer votre propre phrase."],
    precaution: null, sensible: [] },
  { id: "moi-et-lautre", titre: "Moi et l'autre", etats: ["tolerance", "hyperactivation"], besoins: ["limites"], protection: ["fawn"], canaux: ["cognitif"], duree: "2min", materiel: null,
    objectif: "Distinguer ce qui vous appartient de ce qui appartient à l'autre personne.",
    etapes: ["Créez deux colonnes : « ce qui m'appartient » et « ce qui appartient à l'autre » (mes émotions / ses émotions, mes choix / ses choix…).", "Demandez-vous : y a-t-il une chose que je porte peut-être à la place de quelqu'un d'autre ?"],
    precaution: null, sensible: [] },
  { id: "zone-neutre", titre: "La zone neutre", etats: ["dissociation", "hypoactivation"], besoins: ["corps"], protection: [], canaux: ["tactile"], duree: "30s", materiel: null,
    objectif: "Reprendre contact avec le corps par une zone facile, sans passer par l'endroit le plus inconfortable.",
    etapes: ["Cherchez une zone neutre ou facile à sentir : un doigt, le bout du nez, les cheveux, les pieds, le contact du vêtement.", "Restez simplement avec cette zone quelques secondes."],
    precaution: null, sensible: ["toucher_corps", "interoception"] },
  { id: "balance-attention", titre: "La balance de l'attention", etats: ["hyperactivation", "dissociation"], besoins: ["corps"], protection: [], canaux: ["cognitif", "tactile"], duree: "2min", materiel: null,
    objectif: "Découvrir que l'attention peut se déplacer, sans rester bloquée sur une sensation difficile.",
    etapes: ["Remarquez brièvement quelque chose d'inconfortable, puis dirigez votre attention vers un objet, un son ou un appui.", "Revenez vers l'extérieur autant de fois que nécessaire. Le but n'est pas d'explorer l'inconfort."],
    precaution: null, sensible: ["interoception"] },
  { id: "remarque-pensee", titre: "Je remarque que j'ai la pensée…", etats: ["hyperactivation", "tolerance"], besoins: ["mental"], protection: [], canaux: ["cognitif"], duree: "2min", materiel: null,
    objectif: "Créer un peu de distance avec une pensée, sans chercher à la transformer de force.",
    etapes: ["Plutôt que « je vais échouer », essayez : « je remarque que j'ai la pensée : je vais échouer ».", "Demandez-vous ce qu'est cette pensée : une information, une hypothèse, une peur, un souvenir, ou je ne sais pas."],
    precaution: null, sensible: [] },
  { id: "nom-du-film", titre: "Le nom du film", etats: ["hyperactivation", "tolerance"], besoins: ["mental"], protection: [], canaux: ["cognitif"], duree: "2min", materiel: null,
    objectif: "Repérer un scénario mental répétitif, sans obligation de l'arrêter.",
    etapes: ["Si vos pensées étaient un film qui repasse souvent, quel pourrait être son titre ?", "Vous pouvez simplement remarquer : « ah, ce film est revenu », sans avoir besoin de l'arrêter."],
    precaution: null, sensible: [] },
  { id: "une-chose-a-la-fois", titre: "Une chose à la fois", etats: ["hyperactivation", "tolerance"], besoins: ["mental"], protection: [], canaux: ["cognitif"], duree: "30s", materiel: null,
    objectif: "Réduire une charge mentale trop large à une seule étape accessible.",
    etapes: ["Pas toute la journée, pas tout le problème : seulement la prochaine chose.", "Quelle est la prochaine étape suffisamment petite ?"],
    precaution: null, sensible: [] },
  { id: "parler-comme-a-quelquun", titre: "Parler comme à quelqu'un qu'on aime", etats: ["tolerance", "hyperactivation", "hypoactivation"], besoins: ["douceur"], protection: [], canaux: ["cognitif"], duree: "2min", materiel: null,
    objectif: "Trouver une phrase bienveillante sans recourir à des formules positives forcées.",
    etapes: ["Imaginez qu'une personne que vous aimez vive exactement ce que vous vivez. Que ne lui diriez-vous surtout pas ? Que pourriez-vous lui dire sans nier sa difficulté ?", "Choisissez une seule de ces phrases pour vous-même."],
    precaution: null, sensible: [] },
  { id: "cest-difficile-et", titre: "C'est difficile et…", etats: ["tolerance", "hyperactivation", "hypoactivation"], besoins: ["douceur"], protection: [], canaux: ["cognitif"], duree: "30s", materiel: null,
    objectif: "Reconnaître la difficulté sans la nier, tout en gardant un peu d'espace.",
    etapes: ["Complétez : « C'est difficile et je peux avancer par petites étapes. », « C'est difficile et je n'ai pas besoin de tout résoudre maintenant. »", "Vous pouvez créer votre propre phrase."],
    precaution: null, sensible: [] },
  { id: "qui-peut-etre-la", titre: "Qui peut être là, même un peu ?", etats: ["tolerance", "hyperactivation", "hypoactivation"], besoins: ["lien"], protection: [], canaux: ["relationnel"], duree: "2min", materiel: null,
    objectif: "Identifier un contact possible, même minime, sans avoir à tout raconter.",
    etapes: ["Vous n'avez pas forcément besoin de raconter toute votre histoire.", "Existe-t-il quelqu'un à qui vous pourriez envoyer un simple message, demander « tu es disponible ? », ou demander une présence silencieuse ?"],
    precaution: null, sensible: [] },
  { id: "message-prepare", titre: "Le message préparé", etats: ["tolerance", "hyperactivation", "hypoactivation"], besoins: ["lien"], protection: [], canaux: ["relationnel"], duree: "2min", materiel: null,
    objectif: "Préparer à l'avance des messages simples pour les moments où parler est difficile.",
    etapes: ["Vous pouvez préparer et enregistrer des messages comme : « Je ne vais pas très bien. Je n'ai pas besoin de solution, juste de présence. », « Peux-tu rester avec moi quelques minutes ? »"],
    precaution: null, sensible: [] },
  { id: "cartographie-perso", titre: "Ma cartographie personnelle", etats: ["tolerance"], besoins: ["tolerance_renforcer"], protection: [], canaux: ["cognitif"], duree: "10min", materiel: null,
    objectif: "Mieux connaître votre propre fonctionnement, en dehors des moments de crise.",
    etapes: ["Décrivez, en trois espaces : quand je suis suffisamment régulé·e (je remarque…, je peux…) ; quand je monte vers l'hyperactivation (les premiers signes sont…) ; quand je descends vers l'hypoactivation (les premiers signes sont…).", "Cette cartographie peut être enregistrée et modifiée au fil du temps."],
    precaution: null, sensible: [] },
  { id: "signaux-precoces", titre: "Mes signaux précoces", etats: ["tolerance"], besoins: ["tolerance_renforcer"], protection: [], canaux: ["cognitif"], duree: "5min", materiel: null,
    objectif: "Repérer les tout premiers signes, avant l'intensité maximale.",
    etapes: ["Passez en revue plusieurs catégories : corps, pensées, émotions, comportements, relations, sommeil, agitation.", "Construisez votre propre liste de signaux précoces."],
    precaution: null, sensible: [] },
  { id: "menu-regulation", titre: "Mon menu de régulation", etats: ["tolerance"], besoins: ["tolerance_renforcer"], protection: [], canaux: ["cognitif"], duree: "10min", materiel: null,
    objectif: "Préparer à l'avance ce qui peut aider à différents niveaux d'intensité.",
    etapes: ["Notez, pour chaque niveau : quand je vais plutôt bien (ce qui entretient mon équilibre) ; quand je commence à être activé·e (ce qui m'aide tôt) ; quand c'est très intense (ce qui est simple) ; quand je ne peux plus gérer seul·e (qui contacter)."],
    precaution: null, sensible: [] },
];

/* ---------------------------------------------------------------
   CONTENU — Réponses de protection Fight / Flight / Freeze / Fawn
--------------------------------------------------------------- */
const FFFF_INFO = [
  {
    id: "fight",
    label: "Fight — lutter / se défendre",
    color: "terracotta",
    desc: "Le corps se prépare à faire face, à repousser, à se défendre, à reprendre du contrôle.",
    signes: ["Colère", "Tension musculaire", "Mâchoire serrée", "Besoin d'avoir raison", "Envie de crier", "Irritabilité", "Sentiment d'injustice très fort"],
    phrase: "Cette réaction peut être une tentative du système nerveux pour restaurer une impression de puissance ou de protection.",
  },
  {
    id: "flight",
    label: "Flight — fuir / éviter",
    color: "blue",
    desc: "Le corps cherche à s'éloigner de ce qui est perçu comme menaçant, physiquement ou mentalement.",
    signes: ["Envie de partir", "Agitation", "Difficulté à rester en place", "Évitement", "Besoin de s'occuper sans arrêt", "Pensées rapides", "Anticipation"],
    phrase: "Cette réaction peut être une tentative du système nerveux pour retrouver de la distance et de la sécurité.",
  },
  {
    id: "freeze",
    label: "Freeze — se figer / se bloquer",
    color: "stone",
    desc: "Le corps se met en pause. Il peut devenir difficile de parler, de bouger, de choisir ou de penser clairement.",
    signes: ["Sidération", "Corps figé", "Silence impossible à rompre", "Regard fixe", "Temps ralenti", "Confusion", "Déconnexion partielle"],
    phrase: "Cette réaction n'est pas un manque de volonté. Le système nerveux peut figer l'action quand il ne trouve pas d'issue immédiate.",
  },
  {
    id: "fawn",
    label: "Fawn — s'adapter / apaiser l'autre",
    color: "sage",
    desc: "Le système cherche à préserver le lien ou à éviter le danger en s'adaptant fortement à l'autre, parfois au détriment de ses propres besoins.",
    signes: ["Dire oui alors qu'on pense non", "S'excuser excessivement", "Minimiser ce qu'on ressent", "Chercher à calmer l'autre à tout prix", "Éviter le conflit", "Perdre l'accès à ses propres limites"],
    phrase: "Cette réaction peut être une stratégie de protection, surtout lorsque le lien ou l'approbation de l'autre ont semblé nécessaires pour être en sécurité.",
  },
];

const FFFF_CHECKIN_OPTIONS = [
  { id: "fight", label: "Je me défends / je lutte" },
  { id: "flight", label: "J'ai envie de fuir ou d'éviter" },
  { id: "freeze", label: "Je me fige" },
  { id: "fawn", label: "Je cherche à apaiser ou satisfaire l'autre" },
  { id: "plusieurs", label: "Plusieurs à la fois" },
  { id: "ne_sait_pas", label: "Je ne sais pas" },
  { id: "non_renseigne", label: "Je préfère ne pas répondre" },
];

/* ---------------------------------------------------------------
   CONTENU — Fiches de psychoéducation (8)
--------------------------------------------------------------- */
const PSYCHOED_FICHES = [
  {
    titre: "Qu'est-ce que la régulation émotionnelle ?",
    paragraphes: [
      "Réguler une émotion ne veut pas dire la supprimer, l'effacer ou faire comme si elle n'existait pas. Cela signifie retrouver progressivement une capacité à la traverser, sans être totalement submergé·e par elle.",
      "Concrètement, cela peut vouloir dire rester en lien avec ce qui se passe dans votre corps, avec vos pensées, et avec ce qui vous entoure, même quand l'émotion est intense. Une émotion « régulée » n'est pas une émotion qui a disparu : c'est une émotion qui reste vivable, qui laisse encore un peu de place pour réfléchir, choisir, ou demander de l'aide si besoin.",
      "Ce n'est pas un état fixe. On peut se sentir bien régulé·e à un moment, puis débordé·e l'instant d'après, puis revenir vers plus de stabilité un peu plus tard. Ces allers-retours sont normaux. Ils ne sont pas un échec.",
    ],
  },
  {
    titre: "Pourquoi mon corps réagit-il aussi fort ?",
    paragraphes: [
      "Le corps peut réagir très vite lorsqu'il perçoit une menace, parfois avant même que vous ayez eu le temps de comprendre ce qui se passe. C'est un mécanisme de protection ancien, qui n'attend pas toujours que la pensée ait fini son travail pour agir.",
      "Parfois, cette menace est bien réelle et actuelle. Parfois, elle réactive une mémoire ancienne : une situation présente peut ressembler, dans ce qu'elle déclenche dans le corps, à quelque chose de plus ancien et de difficile. Dans les deux cas, la réaction du corps est bien réelle, même si son origine n'est pas toujours évidente sur le moment.",
      "Ce n'est ni un choix, ni un manque de contrôle, ni une exagération. C'est une réaction automatique. Elle peut évoluer avec le temps, en particulier si elle est accompagnée, notamment par un professionnel formé à ces questions.",
    ],
  },
  {
    titre: "Hyperactivation et hypoactivation",
    paragraphes: [
      "Face à une émotion intense, le système nerveux peut prendre deux grandes directions, parfois même successivement.",
      "Certaines réactions vont vers l'accélération : agitation, cœur qui bat plus vite, pensées rapides, panique, colère, envie de fuir ou de se défendre. C'est ce qu'on appelle l'hyperactivation. D'autres réactions vont au contraire vers le ralentissement : fatigue soudaine, sensation de vide, brouillard mental, figement, impression d'être coupé·e de soi ou des autres. C'est l'hypoactivation.",
      "Ce sont deux grandes manières, très différentes en apparence, pour le système nerveux de tenter de nous protéger quand il perçoit qu'il y a trop à gérer. Personne ne réagit toujours de la même façon : on peut basculer de l'une à l'autre selon les situations, les périodes, ou même au cours d'une même journée.",
    ],
  },
  {
    titre: "La stabilisation",
    paragraphes: [
      "La stabilisation correspond à l'ensemble des outils qui peuvent aider à retrouver un peu de sécurité, d'ancrage, de présence ou de choix, quand une émotion ou une réaction du corps devient difficile à traverser.",
      "Elle ne consiste pas à nier ce qui est difficile, ni à forcer un retour au calme. Il s'agit plutôt d'aider le système nerveux à ne pas rester seul avec une intensité trop forte, en lui proposant un point d'appui : un contact, un repère sensoriel, un mouvement, une présence.",
      "La stabilisation n'est pas une fin en soi et ne remplace pas un travail thérapeutique de fond. Elle peut simplement offrir un peu plus d'espace, ici et maintenant, pour respirer, réfléchir ou demander de l'aide.",
    ],
  },
  {
    titre: "Pourquoi les exercices ne fonctionnent pas toujours ?",
    paragraphes: [
      "Le système nerveux ne réagit pas sur commande. Un exercice peut aider beaucoup un jour, un peu un autre jour, et ne rien changer une troisième fois. Ce n'est pas un échec, ni de votre part, ni de la part de l'exercice.",
      "Plusieurs choses peuvent expliquer cela : le niveau de fatigue, le contexte, l'intensité de ce qui est traversé, ou simplement le fait qu'un même outil ne convient pas à tout le monde ni à tout moment.",
      "Si un exercice ne vous aide pas, vous pouvez en essayer un autre, revenir plus tard, ou choisir de ne rien faire de particulier sur le moment. Il peut aussi être utile d'en parler avec un professionnel, qui pourra vous aider à ajuster ce qui vous convient.",
    ],
  },
  {
    titre: "Créer sa boîte à outils personnelle",
    paragraphes: [
      "Chaque personne peut repérer, petit à petit, ce qui l'aide réellement — et cela ne ressemble jamais tout à fait à ce qui aide quelqu'un d'autre.",
      "Cela peut passer par le mouvement, le contact avec une surface ou une texture, la respiration observée sans contrainte, le lien avec une personne de confiance, la créativité, le contact avec la nature, l'écriture, la musique, le silence, la chaleur, le froid, ou encore la présence d'un animal.",
      "Construire sa boîte à outils, c'est accepter d'essayer, de garder ce qui aide un peu, de laisser de côté ce qui n'aide pas, et de continuer à l'ajuster au fil du temps. Rien n'a besoin d'être trouvé une fois pour toutes.",
    ],
  },
  {
    titre: "Comprendre les réponses Fight, Flight, Freeze, Fawn",
    paragraphes: [
      "Face à une menace réelle ou perçue, le système nerveux peut déclencher automatiquement l'une de ces réponses : lutter (Fight), fuir (Flight), se figer (Freeze), ou s'adapter à l'autre pour préserver le lien (Fawn).",
      "Ces réponses ne sont pas choisies consciemment, et elles ne disent rien de la valeur ou de la personnalité de quelqu'un. Elles ont une fonction : aider à survivre à une situation perçue comme dangereuse, ou à préserver un lien qui semblait nécessaire à la sécurité.",
      "Ces réponses ne sont pas des défauts de personnalité. Elles sont des réponses de protection, apprises souvent très tôt. Les reconnaître — sans les juger — peut aider, petit à petit, à retrouver un peu plus de choix face à ce qui se déclenche automatiquement.",
    ],
  },
  {
    titre: "Pourquoi je cherche parfois à apaiser l'autre ?",
    paragraphes: [
      "Certaines personnes ont appris, parfois très tôt dans leur histoire, que préserver le lien, éviter le conflit ou anticiper les besoins de l'autre était une manière de rester en sécurité. C'est ce qu'on appelle la réponse Fawn.",
      "Cette stratégie a souvent été utile, à un moment donné, dans un contexte particulier. Elle a pu permettre d'éviter une réaction difficile, de garder un lien important, ou simplement de traverser une situation qui semblait risquée.",
      "Elle peut cependant devenir coûteuse lorsqu'elle se répète dans des contextes où elle n'est plus nécessaire, et qu'elle empêche de sentir ses propres limites, ses propres besoins, ou son propre « non ». Le reconnaître n'est pas un jugement : c'est une porte d'entrée possible vers un peu plus de choix.",
    ],
  },
];

const CRISIS_EXERCISE = {
  id: "crise-court", titre: "Un tout petit exercice d'orientation",
  etats: [], besoins: ["orienter"], protection: [], canaux: ["visuel"], duree: "30s", materiel: null,
  objectif: "Un point d'appui très simple, pour tout de suite.",
  etapes: ["Nommez juste 3 choses que vous voyez autour de vous, là, maintenant.", "Rien d'autre à faire."],
  precaution: null, sensible: [],
};

const SENSATIONS = [
  "Cœur qui bat vite", "Respiration courte", "Boule dans la gorge", "Oppression",
  "Tensions musculaires", "Mâchoire serrée", "Chaleur", "Tremblements",
  "Agitation", "Envie de fuir", "Envie de pleurer", "Colère", "Peur",
  "Hypervigilance", "Sidération", "Fatigue intense", "Corps lourd",
  "Engourdissement", "Impression d'être loin", "Difficulté à penser",
  "Confusion", "Envie de disparaître", "Difficulté à dire non",
];

const NS_STATES = [
  {
    id: "tolerance",
    label: "Zone de tolérance",
    desc: "Je me sens globalement présent·e. Je peux penser, ressentir, parler, choisir. Il peut y avoir de l'émotion, mais elle reste traversable.",
    color: "sage",
  },
  {
    id: "hyperactivation",
    label: "Hyperactivation",
    desc: "Mon système est en alerte. Je peux me sentir anxieux·se, agité·e, en colère, paniqué·e, tendu·e ou débordé·e.",
    color: "terracotta",
  },
  {
    id: "hypoactivation",
    label: "Hypoactivation",
    desc: "Mon système semble se mettre en retrait. Je peux me sentir vide, absent·e, figé·e, fatigué·e, engourdi·e ou coupé·e de moi-même.",
    color: "blue",
  },
  {
    id: "mixte",
    label: "État mixte",
    desc: "Je me sens agité·e et coupé·e à la fois — par exemple le corps figé mais le cœur très rapide, ou une forte peur avec une sensation d'irréalité.",
    color: "stone",
  },
  {
    id: "dissociation",
    label: "Dissocié·e, irréel·le ou loin",
    desc: "Je ne sais plus très bien où je suis, tout paraît irréel, mon corps paraît loin, ou j'ai un trou dans le temps.",
    color: "stone",
  },
];

/* ---------------------------------------------------------------
   STORAGE HELPERS
--------------------------------------------------------------- */
async function loadJSON(key, fallback) {
  try {
    const res = await window.storage.get(key, false);
    return res ? JSON.parse(res.value) : fallback;
  } catch {
    return fallback;
  }
}
async function saveJSON(key, value) {
  try {
    await window.storage.set(key, JSON.stringify(value), false);
  } catch (e) {
    console.error("Erreur de sauvegarde", e);
  }
}

/* ---------------------------------------------------------------
   SMALL UI PRIMITIVES
--------------------------------------------------------------- */
function Btn({ children, onClick, variant = "primary", c, style, ...rest }) {
  const base = {
    padding: "14px 20px",
    borderRadius: 16,
    border: "none",
    fontFamily: fontBody,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    transition: "transform .15s ease, opacity .15s ease",
  };
  const variants = {
    primary: { background: c.sage, color: c.text },
    secondary: { background: c.card, color: c.text, border: `1px solid ${c.border}` },
    soft: { background: c.blueSoft, color: c.text },
    warn: { background: c.terracottaSoft, color: c.text },
    ghost: { background: "transparent", color: c.textSoft, textAlign: "center", justifyContent: "center" },
  };
  return (
    <button
      onClick={onClick}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      style={{ ...base, ...variants[variant], ...style }}
      {...rest}
    >
      {children}
    </button>
  );
}

function Card({ children, c, style }) {
  return (
    <div
      style={{
        background: c.card,
        border: `1px solid ${c.border}`,
        borderRadius: 20,
        padding: 20,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function ScreenTitle({ children, c }) {
  return (
    <h1
      style={{
        fontFamily: fontDisplay,
        fontWeight: 500,
        fontSize: 26,
        color: c.text,
        margin: "4px 0 14px",
        lineHeight: 1.25,
      }}
    >
      {children}
    </h1>
  );
}

function BackRow({ onBack, c, label = "Retour à l'accueil" }) {
  return (
    <button
      onClick={onBack}
      style={{
        background: "none",
        border: "none",
        color: c.textSoft,
        fontFamily: fontBody,
        fontSize: 13,
        cursor: "pointer",
        padding: "4px 0 12px",
      }}
    >
      ← {label}
    </button>
  );
}

/* ---------------------------------------------------------------
   MAIN APP
--------------------------------------------------------------- */
export default function App() {
  const [theme, setTheme] = useState("light");
  const [screen, setScreen] = useState("home");
  const [history, setHistory] = useState([]); // nav stack
  const [loading, setLoading] = useState(true);

  // draft check-in state
  const [intensity, setIntensity] = useState(null);
  const [sensations, setSensations] = useState([]);
  const [nsState, setNsState] = useState(null);
  const [ffffState, setFfffState] = useState(null);

  // exercise flow
  const [activeExercise, setActiveExercise] = useState(null);
  const [exerciseSource, setExerciseSource] = useState(null); // 'library' | 'crisis'
  const [libraryInitialEtat, setLibraryInitialEtat] = useState(null);
  const [libraryInitialProtection, setLibraryInitialProtection] = useState(null);
  const [avoidPrefs, setAvoidPrefs] = useState([]);
  const [exoFeedback, setExoFeedback] = useState({});
  const [customExercises, setCustomExercises] = useState([]);

  // persisted data
  const [safetyPlan, setSafetyPlan] = useState({
    signes: "", personnes: "", lieux: "", eviter: "", phrases: "", numeros: "",
  });
  const [entries, setEntries] = useState([]);
  const [zonePerso, setZonePerso] = useState({
    hyper: "", hypo: "", tolerance: "", signes: "",
  });

  const c = palette[theme];

  useEffect(() => {
    (async () => {
      const t = await loadJSON("settings:theme", "light");
      const sp = await loadJSON("securite:plan", null);
      const en = await loadJSON("suivi:entries", []);
      const zp = await loadJSON("zone:personnalisation", null);
      const ap = await loadJSON("exo:avoid", []);
      const fb = await loadJSON("exo:feedback", {});
      const ce = await loadJSON("exo:custom", []);
      setTheme(t);
      if (sp) setSafetyPlan(sp);
      setEntries(en);
      if (zp) setZonePerso(zp);
      setAvoidPrefs(ap);
      setExoFeedback(fb);
      setCustomExercises(ce);
      setLoading(false);
    })();
  }, []);

  const goTo = useCallback((s) => {
    setHistory((h) => [...h, screen]);
    setScreen(s);
  }, [screen]);

  const goBackHome = useCallback(() => {
    setHistory([]);
    setScreen("home");
    setIntensity(null);
    setSensations([]);
    setNsState(null);
    setFfffState(null);
    setActiveExercise(null);
    setLibraryInitialEtat(null);
    setLibraryInitialProtection(null);
  }, []);

  const goBack = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) { setScreen("home"); return h; }
      const copy = [...h];
      const prev = copy.pop();
      setScreen(prev);
      return copy;
    });
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    saveJSON("settings:theme", next);
  };

  const updateSafetyPlan = (field, value) => {
    const next = { ...safetyPlan, [field]: value };
    setSafetyPlan(next);
  };
  const persistSafetyPlan = () => saveJSON("securite:plan", safetyPlan);

  const updateZonePerso = (field, value) => setZonePerso((prev) => ({ ...prev, [field]: value }));
  const persistZonePerso = () => saveJSON("zone:personnalisation", zonePerso);

  const addEntry = async (entry) => {
    const next = [{ ...entry, date: new Date().toISOString() }, ...entries].slice(0, 200);
    setEntries(next);
    await saveJSON("suivi:entries", next);
  };

  const saveAvoidPrefs = async (next) => { setAvoidPrefs(next); await saveJSON("exo:avoid", next); };
  const saveExoFeedback = async (id, value) => {
    const next = { ...exoFeedback, [id]: value };
    setExoFeedback(next);
    await saveJSON("exo:feedback", next);
  };
  const saveCustomExercise = async (ex) => {
    const next = [...customExercises, ex];
    setCustomExercises(next);
    await saveJSON("exo:custom", next);
    goBackHome();
  };

  const wipeAllData = async () => {
    try {
      await window.storage.delete("securite:plan", false);
      await window.storage.delete("suivi:entries", false);
      await window.storage.delete("settings:theme", false);
      await window.storage.delete("zone:personnalisation", false);
      await window.storage.delete("exo:avoid", false);
      await window.storage.delete("exo:feedback", false);
      await window.storage.delete("exo:custom", false);
    } catch {}
    setSafetyPlan({ signes: "", personnes: "", lieux: "", eviter: "", phrases: "", numeros: "" });
    setEntries([]);
    setZonePerso({ hyper: "", hypo: "", tolerance: "", signes: "" });
    setAvoidPrefs([]);
    setExoFeedback({});
    setCustomExercises([]);
    goBackHome();
  };

  if (loading) {
    return (
      <div style={{ background: c.bg, minHeight: 500, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontBody, color: c.textSoft }}>
        Chargement…
      </div>
    );
  }

  return (
    <div style={{ background: c.bg, minHeight: 620, fontFamily: fontBody, transition: "background .3s" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "22px 18px 100px", position: "relative" }}>

        {screen === "home" && <Home c={c} theme={theme} toggleTheme={toggleTheme} goTo={goTo} />}

        {screen === "checkin-1" && (
          <CheckinIntensity c={c} onBack={goBackHome}
            onSubmit={(v) => { setIntensity(v); if (v >= 9) { goTo("crisis"); } else { goTo("checkin-2"); } }} />
        )}

        {screen === "checkin-2" && (
          <CheckinSensations c={c} onBack={goBack} sensations={sensations} setSensations={setSensations}
            onNext={() => goTo("checkin-3")} />
        )}

        {screen === "checkin-3" && (
          <CheckinState c={c} onBack={goBack}
            onSelect={(s) => {
              setNsState(s);
              goTo("checkin-4");
            }} />
        )}

        {screen === "checkin-4" && (
          <CheckinFFFF c={c} onBack={goBack}
            onSelect={(f) => {
              setFfffState(f);
              addEntry({ type: "check-in", intensite: intensity, sensations, etat: nsState, ffff: f });
              goTo("checkin-done");
            }} />
        )}

        {screen === "checkin-done" && (
          <CheckinDone c={c} state={nsState} ffff={ffffState} goBackHome={goBackHome}
            onExercises={() => {
              setExerciseSource("library");
              const ffffCat = ["fight", "flight", "freeze", "fawn"].includes(ffffState) ? ffffState : null;
              setLibraryInitialEtat(nsState);
              setLibraryInitialProtection(ffffCat);
              goTo("library");
            }} />
        )}

        {screen === "crisis" && (
          <Crisis c={c} onBack={goBackHome}
            onQuickExercise={() => { setActiveExercise(CRISIS_EXERCISE); setExerciseSource("crisis"); goTo("exercise"); }}
            onSafety={() => goTo("safety")}
            onContacts={() => goTo("safety")}
          />
        )}

        {screen === "library" && (
          <Library c={c} onBack={goBack}
            initialEtat={libraryInitialEtat} initialProtection={libraryInitialProtection}
            avoidPrefs={avoidPrefs} feedback={exoFeedback} customExercises={customExercises}
            onPick={(ex) => { setActiveExercise(ex); goTo("exercise"); }}
            onGoPreferences={() => goTo("preferences")}
            onGoCreate={() => goTo("exo-create")} />
        )}

        {screen === "preferences" && (
          <Preferences c={c} onBack={goBack} avoidPrefs={avoidPrefs} onSave={saveAvoidPrefs} />
        )}

        {screen === "exo-create" && (
          <CreateExercise c={c} onBack={goBack} onSave={saveCustomExercise} />
        )}

        {screen === "tolerance-zone" && (
          <ToleranceZone c={c} onBack={goBackHome} perso={zonePerso}
            onChange={updateZonePerso} onSave={persistZonePerso} />
        )}

        {screen === "protection" && (
          <Protection c={c} onBack={goBackHome}
            onExercises={(cat) => { setLibraryInitialEtat(null); setLibraryInitialProtection(cat); goTo("library"); }} />
        )}

        {screen === "psychoed" && <Psychoeducation c={c} onBack={goBackHome} />}

        {screen === "exercise" && activeExercise && (
          <Exercise c={c} exercise={activeExercise}
            onStop={goBackHome}
            onFinish={(effet, remarque) => {
              addEntry({ type: "exercice", exercice: activeExercise.titre, effet, remarque, intensite: intensity, etat: nsState });
              saveExoFeedback(activeExercise.id, effet);
              goTo("exercise-done");
            }} />
        )}

        {screen === "exercise-done" && (
          <ExerciseDone c={c} goBackHome={goBackHome} onAnother={() => goTo("library")} />
        )}

        {screen === "safety" && (
          <SafetyPlan c={c} onBack={goBackHome} plan={safetyPlan} onChange={updateSafetyPlan} onSave={persistSafetyPlan} />
        )}

        {screen === "nervous-system" && <NervousSystem c={c} onBack={goBackHome} />}

        {screen === "journal" && <Journal c={c} onBack={goBackHome} entries={entries} />}

        {screen === "settings" && (
          <Settings c={c} theme={theme} toggleTheme={toggleTheme} onBack={goBackHome} onWipe={wipeAllData} />
        )}

        {/* Bouton flottant global — sauf sur l'écran crise lui-même */}
        {screen !== "crisis" && screen !== "home" && (
          <button
            onClick={() => goTo("crisis")}
            style={{
              position: "fixed",
              bottom: 22,
              left: "50%",
              transform: "translateX(-50%)",
              maxWidth: 440,
              width: "calc(100% - 36px)",
              background: c.terracotta,
              color: "#fff",
              border: "none",
              borderRadius: 999,
              padding: "13px 18px",
              fontFamily: fontBody,
              fontWeight: 600,
              fontSize: 14,
              boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
              cursor: "pointer",
            }}
          >
            J'ai besoin d'aide maintenant
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   SCREENS
--------------------------------------------------------------- */
function Home({ c, theme, toggleTheme, goTo }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={toggleTheme} style={{ background: "none", border: "none", color: c.textSoft, fontSize: 12, cursor: "pointer" }}>
          {theme === "light" ? "🌙 Mode sombre" : "☀️ Mode clair"}
        </button>
      </div>

      <div style={{ fontFamily: fontDisplay, fontSize: 30, color: c.text, marginTop: 8, marginBottom: 14, lineHeight: 1.3 }}>
        Bienvenue.
      </div>
      <p style={{ color: c.textSoft, fontSize: 15, lineHeight: 1.6, marginBottom: 10 }}>
        Cette application peut vous aider à observer votre état intérieur, à mieux comprendre les réactions
        de votre système nerveux et à choisir un exercice de stabilisation adapté. Vous pouvez avancer à votre
        rythme et arrêter à tout moment.
      </p>

      <Card c={c} style={{ background: c.bgAlt, border: "none", marginBottom: 22 }}>
        <p style={{ color: c.textSoft, fontSize: 13, lineHeight: 1.6, margin: 0 }}>
          Cet outil ne remplace pas un accompagnement médical, psychologique ou psychiatrique. En cas de
          danger immédiat, contactez les services d'urgence ou une personne de confiance.
        </p>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Btn c={c} variant="primary" onClick={() => goTo("checkin-1")}>
          Comment je me sens maintenant ? <span>→</span>
        </Btn>
        <Btn c={c} variant="secondary" onClick={() => goTo("tolerance-zone")}>
          Comprendre ma zone de tolérance <span>→</span>
        </Btn>
        <Btn c={c} variant="secondary" onClick={() => goTo("nervous-system")}>
          Comprendre mon système nerveux <span>→</span>
        </Btn>
        <Btn c={c} variant="secondary" onClick={() => goTo("protection")}>
          Reconnaître mes réponses de protection <span>→</span>
        </Btn>
        <Btn c={c} variant="secondary" onClick={() => goTo("library")}>
          Faire un exercice <span>→</span>
        </Btn>
        <Btn c={c} variant="secondary" onClick={() => goTo("psychoed")}>
          Psychoéducation <span>→</span>
        </Btn>
        <Btn c={c} variant="secondary" onClick={() => goTo("safety")}>
          Mes repères de sécurité <span>→</span>
        </Btn>
        <Btn c={c} variant="secondary" onClick={() => goTo("journal")}>
          Mon suivi personnel <span>→</span>
        </Btn>
        <Btn c={c} variant="ghost" onClick={() => goTo("settings")}>
          Réglages
        </Btn>
      </div>
    </div>
  );
}

function CheckinIntensity({ c, onBack, onSubmit }) {
  const [val, setVal] = useState(5);
  const anchors = [
    [0, "très calme, voire éteint·e ou coupé·e"],
    [3, "activation faible ou état relativement stable"],
    [6, "émotion présente, mais encore traversable"],
    [8, "activation ou retrait important"],
    [10, "débordement intense, impression de ne plus pouvoir gérer seul·e"],
  ];
  return (
    <div>
      <BackRow c={c} onBack={onBack} />
      <ScreenTitle c={c}>Sur une échelle de 0 à 10</ScreenTitle>
      <p style={{ color: c.textSoft, fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
        Comment évalueriez-vous votre niveau d'activation, de détresse ou de déconnexion maintenant ?
      </p>

      <div style={{ textAlign: "center", fontFamily: fontDisplay, fontSize: 56, color: c.text, marginBottom: 6 }}>
        {val}
      </div>
      <input
        type="range" min={0} max={10} value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        style={{ width: "100%", accentColor: c.sage, marginBottom: 22 }}
      />

      <Card c={c} style={{ marginBottom: 24 }}>
        {anchors.map(([n, txt]) => (
          <div key={n} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13, color: c.textSoft }}>
            <span style={{ fontWeight: 700, color: c.text, minWidth: 46 }}>{n}</span>
            <span>{txt}</span>
          </div>
        ))}
      </Card>

      <Btn c={c} variant="primary" onClick={() => onSubmit(val)}>Continuer <span>→</span></Btn>
    </div>
  );
}

function CheckinSensations({ c, onBack, sensations, setSensations, onNext }) {
  const toggle = (s) =>
    setSensations((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  return (
    <div>
      <BackRow c={c} onBack={onBack} />
      <ScreenTitle c={c}>Qu'est-ce que vous remarquez ?</ScreenTitle>
      <p style={{ color: c.textSoft, fontSize: 15, lineHeight: 1.6, marginBottom: 18 }}>
        Dans votre corps, ou dans votre état intérieur. Choisissez ce qui résonne — il n'y a pas de bonne réponse.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 26 }}>
        {SENSATIONS.map((s) => {
          const on = sensations.includes(s);
          return (
            <button key={s} onClick={() => toggle(s)}
              style={{
                padding: "9px 14px", borderRadius: 999, fontSize: 13, cursor: "pointer",
                border: `1px solid ${on ? c.sage : c.border}`,
                background: on ? c.sageSoft : c.card, color: c.text,
              }}>
              {s}
            </button>
          );
        })}
      </div>
      <Btn c={c} variant="primary" onClick={onNext}>Continuer <span>→</span></Btn>
    </div>
  );
}

function CheckinState({ c, onBack, onSelect }) {
  return (
    <div>
      <BackRow c={c} onBack={onBack} />
      <ScreenTitle c={c}>Où en êtes-vous ?</ScreenTitle>
      <p style={{ color: c.textSoft, fontSize: 15, lineHeight: 1.6, marginBottom: 18 }}>
        Choisissez ce qui vous semble le plus proche de votre état, maintenant.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {NS_STATES.map((s) => (
          <button key={s.id} onClick={() => onSelect(s.id)}
            style={{
              textAlign: "left", padding: 18, borderRadius: 18, cursor: "pointer",
              border: `1px solid ${c.border}`, background: c[s.color + "Soft"],
            }}>
            <div style={{ fontWeight: 700, color: c.text, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 13, color: c.textSoft, lineHeight: 1.5 }}>{s.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function CheckinFFFF({ c, onBack, onSelect }) {
  return (
    <div>
      <BackRow c={c} onBack={onBack} />
      <ScreenTitle c={c}>Une réaction de protection, peut-être ?</ScreenTitle>
      <p style={{ color: c.textSoft, fontSize: 14, lineHeight: 1.6, marginBottom: 6 }}>
        Cette étape est facultative. Est-ce que vous reconnaissez une réaction de protection en ce moment ?
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
        {FFFF_CHECKIN_OPTIONS.map((o) => (
          <Btn key={o.id} c={c} variant="secondary" onClick={() => onSelect(o.id)}>{o.label}</Btn>
        ))}
      </div>
    </div>
  );
}

function CheckinDone({ c, state, ffff, goBackHome, onExercises }) {
  const s = NS_STATES.find((x) => x.id === state);
  const f = FFFF_INFO.find((x) => x.id === ffff);
  return (
    <div>
      <ScreenTitle c={c}>Merci.</ScreenTitle>
      <p style={{ color: c.textSoft, fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>
        Merci d'avoir pris le temps d'observer cela. Il n'y a rien à réussir ici. L'objectif est simplement de
        mieux comprendre ce qui se passe pour vous maintenant.
      </p>
      {s && (
        <Card c={c} style={{ background: c[s.color + "Soft"], border: "none", marginBottom: 14 }}>
          <div style={{ fontWeight: 700, color: c.text }}>{s.label}</div>
        </Card>
      )}
      {f && (
        <Card c={c} style={{ background: c[f.color + "Soft"], border: "none", marginBottom: 24 }}>
          <div style={{ fontWeight: 700, color: c.text, marginBottom: 6 }}>{f.label}</div>
          <div style={{ fontSize: 13, color: c.textSoft, lineHeight: 1.6 }}>
            Cette réaction peut avoir du sens dans l'histoire de votre système nerveux. L'objectif n'est pas de
            la juger, mais de voir ce qui pourrait vous aider maintenant.
          </div>
        </Card>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Btn c={c} variant="primary" onClick={onExercises}>Voir des exercices adaptés <span>→</span></Btn>
        <Btn c={c} variant="ghost" onClick={goBackHome}>Revenir à l'accueil</Btn>
      </div>
    </div>
  );
}

function Crisis({ c, onBack, onQuickExercise, onSafety, onContacts }) {
  return (
    <div>
      <ScreenTitle c={c}>Ce que vous vivez semble très intense.</ScreenTitle>
      <p style={{ color: c.textSoft, fontSize: 15, lineHeight: 1.6, marginBottom: 26 }}>
        L'objectif n'est pas de gérer cela seul·e. Vous pouvez essayer un exercice très simple d'orientation,
        contacter une personne ressource ou utiliser vos repères de sécurité. Si vous êtes en danger, contactez
        immédiatement les services d'urgence.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        <Btn c={c} variant="primary" onClick={onQuickExercise}>Faire un exercice très court <span>→</span></Btn>
        <Btn c={c} variant="soft" onClick={onSafety}>Voir mes repères de sécurité <span>→</span></Btn>
        <Btn c={c} variant="soft" onClick={onContacts}>Contacter une personne ressource <span>→</span></Btn>
        <Btn c={c} variant="warn" onClick={() => {}}>Je suis en danger / aide urgente <span>☎</span></Btn>
      </div>
      <Card c={c} style={{ background: c.bgAlt, border: "none", marginBottom: 20 }}>
        <p style={{ margin: 0, fontSize: 13, color: c.textSoft, lineHeight: 1.6 }}>
          Vous n'avez pas à traverser cela seul·e. En France : 15 (SAMU), 3114 (numéro national de prévention du
          suicide, 24h/24), 112 (urgence en Europe).
        </p>
      </Card>
      <Btn c={c} variant="ghost" onClick={onBack}>Revenir à l'accueil</Btn>
    </div>
  );
}

function Chip({ active, onClick, children, c }) {
  return (
    <button onClick={onClick} style={{
      padding: "7px 13px", borderRadius: 999, fontSize: 12.5, cursor: "pointer", whiteSpace: "nowrap",
      border: `1px solid ${active ? c.sage : c.border}`, background: active ? c.sageSoft : c.card, color: c.text,
    }}>{children}</button>
  );
}

function FacetRow({ title, options, value, onToggle, c }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, color: c.textSoft, marginBottom: 6 }}>{title}</div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
        {options.map((o) => (
          <Chip key={o.id} c={c} active={value === o.id} onClick={() => onToggle(value === o.id ? null : o.id)}>{o.label}</Chip>
        ))}
      </div>
    </div>
  );
}

function matchesExercise(ex, f) {
  if (f.etat && ex.etats.length && !ex.etats.includes(f.etat)) return false;
  if (f.besoin && !ex.besoins.includes(f.besoin)) return false;
  if (f.protection && !ex.protection.includes(f.protection)) return false;
  if (f.canal && !ex.canaux.includes(f.canal)) return false;
  if (f.duree) {
    const order = ["30s", "2min", "5min", "10min"];
    if (order.indexOf(ex.duree) > order.indexOf(f.duree)) return false;
  }
  if (f.avoid && f.avoid.length && ex.sensible.some((s) => f.avoid.includes(s))) return false;
  return true;
}

function Library({ c, onBack, initialEtat, initialProtection, avoidPrefs, feedback, customExercises, onPick, onGoPreferences, onGoCreate }) {
  const [f, setF] = useState({ etat: initialEtat || null, besoin: null, protection: initialProtection || null, canal: null, duree: null, avoid: avoidPrefs || [] });
  const [showFacets, setShowFacets] = useState(false);
  const [showAvoidPanel, setShowAvoidPanel] = useState(false);

  const allExercises = [...EXERCISES, ...customExercises];
  let list = allExercises.filter((ex) => matchesExercise(ex, f));

  // Trie : ce qui aide "beaucoup" en premier, ce que l'utilisateur préfère éviter en dernier / masqué
  list = list
    .filter((ex) => feedback[ex.id] !== "Je préfère l'éviter")
    .sort((a, b) => {
      const rank = { "Beaucoup": 0, "Un peu": 1, "Cela dépend": 2, "Pas vraiment": 3 };
      const ra = rank[feedback[a.id]] ?? 1.5;
      const rb = rank[feedback[b.id]] ?? 1.5;
      return ra - rb;
    });

  return (
    <div>
      <BackRow c={c} onBack={onBack} />
      <ScreenTitle c={c}>Faire un exercice</ScreenTitle>
      <p style={{ color: c.textSoft, fontSize: 14, lineHeight: 1.6, marginBottom: 14 }}>
        Vous pouvez arrêter à tout moment. Il n'existe pas un exercice qui convient à tout le monde — l'objectif
        est de découvrir progressivement ce qui vous aide, ce qui vous aide parfois, et ce que vous préférez éviter.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        <button onClick={() => setShowFacets((s) => !s)} style={{ fontSize: 12.5, color: c.text, background: c.bgAlt, border: "none", borderRadius: 999, padding: "8px 13px", cursor: "pointer" }}>
          {showFacets ? "Masquer les filtres" : "Affiner ma recherche"}
        </button>
        <button onClick={() => setShowAvoidPanel((s) => !s)} style={{ fontSize: 12.5, color: c.text, background: c.terracottaSoft, border: "none", borderRadius: 999, padding: "8px 13px", cursor: "pointer" }}>
          Ce que je préfère éviter aujourd'hui
        </button>
        <button onClick={onGoPreferences} style={{ fontSize: 12.5, color: c.textSoft, background: "none", border: `1px solid ${c.border}`, borderRadius: 999, padding: "8px 13px", cursor: "pointer" }}>
          Mes préférences
        </button>
      </div>

      {showAvoidPanel && (
        <Card c={c} style={{ marginBottom: 14, background: c.bgAlt, border: "none" }}>
          <p style={{ fontSize: 12.5, color: c.textSoft, margin: "0 0 8px" }}>
            Sélectionnez ce que vous préférez éviter pour cette session (cela ne sera pas proposé) :
          </p>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {EVITER_LIST.map((ev) => {
              const active = f.avoid.includes(ev.id);
              return (
                <Chip key={ev.id} c={c} active={active} onClick={() =>
                  setF((prev) => ({ ...prev, avoid: active ? prev.avoid.filter((x) => x !== ev.id) : [...prev.avoid, ev.id] }))
                }>{ev.label}</Chip>
              );
            })}
          </div>
        </Card>
      )}

      {showFacets && (
        <Card c={c} style={{ marginBottom: 16 }}>
          <FacetRow title="Mon état actuel" options={ETATS_LIST} value={f.etat} onToggle={(v) => setF({ ...f, etat: v })} c={c} />
          <FacetRow title="Ce dont j'ai besoin" options={BESOINS_LIST} value={f.besoin} onToggle={(v) => setF({ ...f, besoin: v })} c={c} />
          <FacetRow title="Ma réaction de protection" options={FFFF_INFO.map((x) => ({ id: x.id, label: x.label.split(" — ")[0] }))} value={f.protection} onToggle={(v) => setF({ ...f, protection: v })} c={c} />
          <FacetRow title="Ce qui me convient aujourd'hui" options={CANAUX_LIST} value={f.canal} onToggle={(v) => setF({ ...f, canal: v })} c={c} />
          <FacetRow title="Le temps que j'ai" options={DUREE_LIST} value={f.duree} onToggle={(v) => setF({ ...f, duree: v })} c={c} />
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
        {list.length === 0 && (
          <Card c={c} style={{ background: c.bgAlt, border: "none" }}>
            <p style={{ margin: 0, fontSize: 14, color: c.textSoft }}>
              Aucun exercice ne correspond exactement à cette combinaison. Vous pouvez élargir vos filtres ou
              créer votre propre exercice.
            </p>
          </Card>
        )}
        {list.map((ex) => (
          <button key={ex.id} onClick={() => onPick(ex)}
            style={{ textAlign: "left", cursor: "pointer", border: `1px solid ${c.border}`, background: c.card, borderRadius: 18, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, gap: 8 }}>
              <span style={{ fontWeight: 700, color: c.text }}>{ex.titre}</span>
              <span style={{ fontSize: 12, color: c.textSoft, whiteSpace: "nowrap" }}>{DUREE_LIST.find((d) => d.id === ex.duree)?.label}</span>
            </div>
            <div style={{ fontSize: 13, color: c.textSoft, lineHeight: 1.5 }}>{ex.objectif}</div>
            {feedback[ex.id] && (
              <div style={{ fontSize: 11, color: c.sage, marginTop: 6 }}>Vous aviez noté : {feedback[ex.id]}</div>
            )}
          </button>
        ))}
      </div>

      <Btn c={c} variant="secondary" onClick={onGoCreate}>Créer mon propre exercice <span>+</span></Btn>
    </div>
  );
}

function Exercise({ c, exercise, onStop, onFinish }) {
  const [step, setStep] = useState("do"); // do | remarque | continuer | feedback
  const [remarque, setRemarque] = useState(null);

  if (step === "remarque") {
    return (
      <div>
        <ScreenTitle c={c}>Qu'est-ce que vous remarquez maintenant ?</ScreenTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 10 }}>
          {REMARQUE_OPTIONS.map((o) => (
            <Btn key={o} c={c} variant={remarque === o ? "primary" : "secondary"} onClick={() => { setRemarque(o); setStep("continuer"); }}>{o}</Btn>
          ))}
        </div>
      </div>
    );
  }

  if (step === "continuer") {
    return (
      <div>
        <ScreenTitle c={c}>Souhaitez-vous continuer ?</ScreenTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Btn c={c} variant="secondary" onClick={() => setStep("do")}>Essayer à nouveau cet exercice</Btn>
          <Btn c={c} variant="secondary" onClick={() => setStep("feedback")}>Essayer autre chose / arrêter ici</Btn>
        </div>
      </div>
    );
  }

  if (step === "feedback") {
    return (
      <div>
        <ScreenTitle c={c}>Cet exercice vous aide généralement…</ScreenTitle>
        <p style={{ color: c.textSoft, fontSize: 13, marginBottom: 16 }}>Sans jugement — juste pour ajuster votre bibliothèque.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FEEDBACK_OPTIONS.map((o) => (
            <Btn key={o} c={c} variant="secondary" onClick={() => onFinish(o, remarque)}>{o}</Btn>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: c.textSoft }}>{DUREE_LIST.find((d) => d.id === exercise.duree)?.label}</span>
      </div>
      <ScreenTitle c={c}>{exercise.titre}</ScreenTitle>
      <p style={{ color: c.textSoft, fontSize: 13, lineHeight: 1.6, marginBottom: 14, fontStyle: "italic" }}>{exercise.objectif}</p>
      {exercise.materiel && (
        <Card c={c} style={{ background: c.bgAlt, border: "none", marginBottom: 14 }}>
          <p style={{ margin: 0, fontSize: 12.5, color: c.textSoft }}>Matériel utile : {exercise.materiel}</p>
        </Card>
      )}
      <Card c={c} style={{ marginBottom: 16 }}>
        {exercise.etapes.map((et, i) => (
          <p key={i} style={{ margin: i === 0 ? 0 : "10px 0 0", fontSize: 15.5, lineHeight: 1.65, color: c.text }}>{et}</p>
        ))}
      </Card>
      {exercise.precaution && (
        <Card c={c} style={{ background: c.terracottaSoft, border: "none", marginBottom: 20 }}>
          <p style={{ margin: 0, fontSize: 12.5, color: c.text, lineHeight: 1.6 }}>{exercise.precaution}</p>
        </Card>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Btn c={c} variant="primary" onClick={() => setStep("remarque")}>J'ai terminé <span>✓</span></Btn>
        <Btn c={c} variant="ghost" onClick={onStop}>Arrêter l'exercice</Btn>
      </div>
    </div>
  );
}

function ExerciseDone({ c, goBackHome, onAnother }) {
  return (
    <div>
      <ScreenTitle c={c}>Merci d'avoir essayé.</ScreenTitle>
      <p style={{ color: c.textSoft, fontSize: 15, lineHeight: 1.6, marginBottom: 26 }}>
        C'est noté dans votre suivi personnel, et votre bibliothèque en tiendra compte la prochaine fois. Ce
        n'est pas une performance — simplement une observation de plus sur ce qui vous aide ou non.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Btn c={c} variant="secondary" onClick={onAnother}>Essayer un autre exercice</Btn>
        <Btn c={c} variant="ghost" onClick={goBackHome}>Revenir à l'accueil</Btn>
      </div>
    </div>
  );
}

function Preferences({ c, onBack, avoidPrefs, onSave }) {
  const [selected, setSelected] = useState(avoidPrefs);
  const [saved, setSaved] = useState(false);
  return (
    <div>
      <BackRow c={c} onBack={onBack} />
      <ScreenTitle c={c}>Mes préférences d'exercices</ScreenTitle>
      <p style={{ color: c.textSoft, fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>
        Ce que vous cochez ici sera écarté par défaut à chaque fois que vous ouvrez la bibliothèque. Vous pourrez
        toujours l'ajuster ponctuellement.
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
        {EVITER_LIST.map((ev) => {
          const active = selected.includes(ev.id);
          return (
            <Chip key={ev.id} c={c} active={active} onClick={() => {
              setSelected((prev) => active ? prev.filter((x) => x !== ev.id) : [...prev, ev.id]);
              setSaved(false);
            }}>{ev.label}</Chip>
          );
        })}
      </div>
      <Btn c={c} variant="primary" onClick={() => { onSave(selected); setSaved(true); }}>
        {saved ? "Enregistré ✓" : "Enregistrer"}
      </Btn>
    </div>
  );
}

function CreateExercise({ c, onBack, onSave }) {
  const [form, setForm] = useState({ titre: "", quandAide: "", duree: "2min", materiel: "", etapesText: "", aEviter: "", personne: "" });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const inputStyle = { width: "100%", borderRadius: 12, border: `1px solid ${c.border}`, background: c.card, color: c.text, padding: 10, fontFamily: fontBody, fontSize: 14, resize: "vertical" };
  const submit = () => {
    if (!form.titre.trim()) return;
    onSave({
      id: "perso-" + Date.now(),
      titre: form.titre,
      etats: [], besoins: [], protection: [], canaux: [], duree: form.duree, materiel: form.materiel || null,
      objectif: form.quandAide || "Exercice personnalisé.",
      etapes: form.etapesText.split("\n").filter(Boolean),
      precaution: form.aEviter ? `À éviter : ${form.aEviter}` : null,
      sensible: [], perso: true, personneRessource: form.personne,
    });
  };
  return (
    <div>
      <BackRow c={c} onBack={onBack} />
      <ScreenTitle c={c}>Créer mon exercice</ScreenTitle>
      {[
        ["titre", "Nom de mon exercice", 1],
        ["quandAide", "Ce qui m'aide / quand je l'utilise", 2],
        ["materiel", "Matériel (optionnel)", 1],
        ["etapesText", "Les étapes (une par ligne)", 4],
        ["aEviter", "Ce que je préfère éviter avec cet exercice", 2],
        ["personne", "La personne qui peut m'aider (optionnel)", 1],
      ].map(([key, label, rows]) => (
        <div key={key} style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, color: c.textSoft, display: "block", marginBottom: 6 }}>{label}</label>
          <textarea value={form[key]} onChange={(e) => set(key, e.target.value)} rows={rows} style={inputStyle} />
        </div>
      ))}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 13, color: c.textSoft, display: "block", marginBottom: 6 }}>Durée approximative</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {DUREE_LIST.map((d) => (
            <Chip key={d.id} c={c} active={form.duree === d.id} onClick={() => set("duree", d.id)}>{d.label}</Chip>
          ))}
        </div>
      </div>
      <Btn c={c} variant="primary" onClick={submit}>Enregistrer mon exercice <span>✓</span></Btn>
    </div>
  );
}

function SafetyPlan({ c, onBack, plan, onChange, onSave }) {
  const [saved, setSaved] = useState(false);
  const fields = [
    ["signes", "Quand je vais mal, les signes à surveiller sont…"],
    ["personnes", "Les personnes que je peux contacter sont…"],
    ["lieux", "Les lieux où je peux aller sont…"],
    ["eviter", "Les choses à éviter quand je suis débordé·e sont…"],
    ["phrases", "Les phrases qui peuvent m'aider sont…"],
    ["numeros", "Les numéros d'urgence ou de soutien sont…"],
  ];
  return (
    <div>
      <BackRow c={c} onBack={onBack} />
      <ScreenTitle c={c}>Mes repères de sécurité</ScreenTitle>
      <Card c={c} style={{ background: c.terracottaSoft, border: "none", marginBottom: 20 }}>
        <p style={{ margin: 0, fontSize: 13, color: c.text, lineHeight: 1.6 }}>
          Si vous êtes en danger immédiat, si vous avez peur de passer à l'acte, ou si vous risquez de vous faire
          du mal ou de faire du mal à quelqu'un, contactez immédiatement les services d'urgence de votre pays ou
          une personne de confiance. Cette application ne remplace pas une aide humaine en situation de crise.
        </p>
      </Card>
      {fields.map(([key, label]) => (
        <div key={key} style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, color: c.textSoft, display: "block", marginBottom: 6 }}>{label}</label>
          <textarea
            value={plan[key]}
            onChange={(e) => { onChange(key, e.target.value); setSaved(false); }}
            rows={2}
            style={{
              width: "100%", borderRadius: 12, border: `1px solid ${c.border}`,
              background: c.card, color: c.text, padding: 10, fontFamily: fontBody, fontSize: 14, resize: "vertical",
            }}
          />
        </div>
      ))}
      <Btn c={c} variant="primary" onClick={() => { onSave(); setSaved(true); }}>
        {saved ? "Enregistré ✓" : "Enregistrer"}
      </Btn>
    </div>
  );
}

function NervousSystem({ c, onBack }) {
  return (
    <div>
      <BackRow c={c} onBack={onBack} />
      <ScreenTitle c={c}>Comprendre les réactions de mon système nerveux</ScreenTitle>
      <p style={{ color: c.textSoft, fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
        Vos réactions face au stress, à la peur, au conflit ou au trauma ne sont pas des choix conscients ni des
        faiblesses. Ce sont des réponses de protection. Ce modèle peut aider certaines personnes à comprendre
        leurs réactions corporelles et relationnelles — il ne résume pas toute la complexité d'une personne.
      </p>
      {[
        ["Sécurité / engagement social", "sage", "Quand le système nerveux perçoit suffisamment de sécurité, nous pouvons être en lien, réfléchir, parler, écouter, ressentir et revenir plus facilement à l'équilibre."],
        ["Mobilisation", "terracotta", "Quand le système nerveux perçoit une menace, il peut mobiliser de l'énergie pour se protéger. Cela peut ressembler à l'envie de fuir, de se défendre, de contrôler, de s'agiter ou de réagir vite."],
        ["Immobilisation / retrait", "blue", "Quand le système nerveux perçoit qu'il n'y a pas d'issue ou que c'est trop, il peut ralentir, figer ou couper certaines sensations. Cela peut donner une impression de vide, d'absence, de fatigue extrême, de brouillard ou d'effondrement."],
      ].map(([titre, color, txt]) => (
        <Card key={titre} c={c} style={{ background: c[color + "Soft"], border: "none", marginBottom: 14 }}>
          <div style={{ fontWeight: 700, color: c.text, marginBottom: 6 }}>{titre}</div>
          <div style={{ fontSize: 13, color: c.textSoft, lineHeight: 1.6 }}>{txt}</div>
        </Card>
      ))}
      <p style={{ color: c.textSoft, fontSize: 13, lineHeight: 1.6, marginTop: 10 }}>
        Ces états ne sont pas des cases fixes. On peut passer de l'un à l'autre rapidement, ou vivre plusieurs
        signes en même temps. L'objectif n'est pas de se diagnostiquer, mais de mieux se repérer.
      </p>
    </div>
  );
}

function ToleranceZone({ c, onBack, perso, onChange, onSave }) {
  const [saved, setSaved] = useState(false);
  const fields = [
    ["hyper", "Chez moi, l'hyperactivation ressemble à…"],
    ["hypo", "Chez moi, l'hypoactivation ressemble à…"],
    ["tolerance", "Quand je suis dans ma zone de tolérance, je remarque que…"],
    ["signes", "Les premiers signes qui montrent que je sors de ma zone de tolérance sont…"],
  ];
  return (
    <div>
      <BackRow c={c} onBack={onBack} />
      <ScreenTitle c={c}>Comprendre ma zone de tolérance</ScreenTitle>

      <p style={{ color: c.textSoft, fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
        La zone de tolérance est l'espace dans lequel notre système nerveux peut ressentir des émotions, même
        désagréables, sans être complètement débordé. Quand nous sommes dans cette zone, nous pouvons encore
        réfléchir, communiquer, faire des choix et revenir progressivement à l'équilibre.
      </p>

      {/* Représentation simple à 3 bandes */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 22 }}>
        <div style={{ background: c.terracottaSoft, borderRadius: "12px 12px 0 0", padding: "10px 14px", fontSize: 13, color: c.text }}>
          Hyperactivation
        </div>
        <div style={{ background: c.sageSoft, padding: "18px 14px", fontSize: 13, color: c.text, fontWeight: 700, textAlign: "center" }}>
          Zone de tolérance
        </div>
        <div style={{ background: c.blueSoft, borderRadius: "0 0 12px 12px", padding: "10px 14px", fontSize: 13, color: c.text }}>
          Hypoactivation
        </div>
      </div>

      <Card c={c} style={{ background: c.terracottaSoft, border: "none", marginBottom: 10 }}>
        <p style={{ margin: 0, fontSize: 13, color: c.text, lineHeight: 1.6 }}>
          Quand le système nerveux perçoit un danger ou une menace, il peut accélérer. Ce n'est pas un échec :
          c'est une réaction de protection.
        </p>
      </Card>
      <Card c={c} style={{ background: c.blueSoft, border: "none", marginBottom: 24 }}>
        <p style={{ margin: 0, fontSize: 13, color: c.text, lineHeight: 1.6 }}>
          Quand le système nerveux est trop débordé ou trop épuisé, il peut ralentir ou se couper. Là aussi, ce
          n'est pas volontaire : c'est une réponse de protection.
        </p>
      </Card>

      <div style={{ fontFamily: fontDisplay, fontSize: 18, color: c.text, marginBottom: 12 }}>
        À vous de compléter, si cela vous convient
      </div>
      {fields.map(([key, label]) => (
        <div key={key} style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, color: c.textSoft, display: "block", marginBottom: 6 }}>{label}</label>
          <textarea
            value={perso[key]}
            onChange={(e) => { onChange(key, e.target.value); setSaved(false); }}
            rows={2}
            style={{
              width: "100%", borderRadius: 12, border: `1px solid ${c.border}`,
              background: c.card, color: c.text, padding: 10, fontFamily: fontBody, fontSize: 14, resize: "vertical",
            }}
          />
        </div>
      ))}
      <Btn c={c} variant="primary" onClick={() => { onSave(); setSaved(true); }} style={{ marginBottom: 20 }}>
        {saved ? "Enregistré ✓" : "Enregistrer"}
      </Btn>

      <p style={{ color: c.textSoft, fontSize: 13, lineHeight: 1.6 }}>
        Le but n'est pas d'être toujours dans sa zone de tolérance. Les variations sont normales. L'objectif est
        d'apprendre à repérer ce qui se passe et à revenir progressivement vers un peu plus de sécurité quand
        c'est possible.
      </p>
    </div>
  );
}

function Protection({ c, onBack, onExercises }) {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <BackRow c={c} onBack={onBack} />
      <ScreenTitle c={c}>Fight, Flight, Freeze, Fawn</ScreenTitle>
      <p style={{ color: c.textSoft, fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
        Face à une menace réelle ou perçue, notre système nerveux peut déclencher des réponses automatiques de
        protection. Elles ne sont pas choisies volontairement. Elles ont pour fonction première de nous aider à
        survivre ou à préserver le lien quand celui-ci semble nécessaire à notre sécurité.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {FFFF_INFO.map((f) => {
          const isOpen = open === f.id;
          return (
            <div key={f.id} style={{ border: `1px solid ${c.border}`, borderRadius: 18, overflow: "hidden" }}>
              <button
                onClick={() => setOpen(isOpen ? null : f.id)}
                style={{
                  width: "100%", textAlign: "left", padding: 16, cursor: "pointer", border: "none",
                  background: c[f.color + "Soft"],
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 700, color: c.text }}>{f.label}</span>
                <span style={{ color: c.textSoft }}>{isOpen ? "–" : "+"}</span>
              </button>
              {isOpen && (
                <div style={{ padding: 16, background: c.card }}>
                  <p style={{ margin: "0 0 10px", fontSize: 14, color: c.text, lineHeight: 1.6 }}>{f.desc}</p>
                  <div style={{ fontSize: 12, color: c.textSoft, marginBottom: 6 }}>Signes possibles :</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                    {f.signes.map((s) => (
                      <span key={s} style={{ fontSize: 12, padding: "5px 10px", borderRadius: 999, background: c.bgAlt, color: c.textSoft }}>
                        {s}
                      </span>
                    ))}
                  </div>
                  <p style={{ margin: "0 0 14px", fontSize: 13, color: c.textSoft, fontStyle: "italic", lineHeight: 1.6 }}>
                    {f.phrase}
                  </p>
                  <Btn c={c} variant="secondary" onClick={() => onExercises(f.id)}>
                    Voir des exercices adaptés <span>→</span>
                  </Btn>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Card c={c} style={{ background: c.bgAlt, border: "none", marginBottom: 12 }}>
        <p style={{ margin: 0, fontSize: 13, color: c.textSoft, lineHeight: 1.6 }}>
          Ces réponses peuvent être utiles dans certains contextes. Elles deviennent surtout coûteuses lorsqu'elles
          se déclenchent très souvent, très intensément, ou dans des situations où le danger n'est plus actuel.
        </p>
      </Card>
      <Card c={c} style={{ background: c.bgAlt, border: "none" }}>
        <p style={{ margin: 0, fontSize: 13, color: c.textSoft, lineHeight: 1.6 }}>
          Les modèles comme la théorie polyvagale ou les réponses Fight, Flight, Freeze, Fawn peuvent aider à
          mettre du sens sur certaines expériences. Ils ne remplacent pas une évaluation clinique et ne résument
          jamais toute la complexité d'une personne.
        </p>
      </Card>
    </div>
  );
}

function Psychoeducation({ c, onBack }) {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <BackRow c={c} onBack={onBack} />
      <ScreenTitle c={c}>Psychoéducation</ScreenTitle>
      <p style={{ color: c.textSoft, fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
        Des fiches courtes, lisibles en moins de deux minutes chacune.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {PSYCHOED_FICHES.map((fiche, i) => {
          const isOpen = open === i;
          return (
            <div key={i} style={{ border: `1px solid ${c.border}`, borderRadius: 16, overflow: "hidden" }}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                style={{
                  width: "100%", textAlign: "left", padding: 14, cursor: "pointer", border: "none",
                  background: c.card, color: c.text, fontWeight: 600, fontSize: 14,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}
              >
                <span>{fiche.titre}</span>
                <span style={{ color: c.textSoft }}>{isOpen ? "–" : "+"}</span>
              </button>
              {isOpen && (
                <div style={{ padding: "0 14px 18px" }}>
                  {fiche.paragraphes.map((p, pi) => (
                    <p key={pi} style={{ margin: pi === 0 ? "0 0 10px" : "0 0 10px", fontSize: 13, color: c.textSoft, lineHeight: 1.65 }}>
                      {p}
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Journal({ c, onBack, entries }) {
  return (
    <div>
      <BackRow c={c} onBack={onBack} />
      <ScreenTitle c={c}>Mon suivi personnel</ScreenTitle>
      <p style={{ color: c.textSoft, fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
        Ce suivi n'est pas là pour mesurer une performance. Il peut simplement vous aider à mieux connaître votre
        fonctionnement et à repérer ce qui vous soutient.
      </p>
      {entries.length === 0 && (
        <Card c={c} style={{ background: c.bgAlt, border: "none" }}>
          <p style={{ margin: 0, color: c.textSoft, fontSize: 14 }}>
            Rien n'est encore enregistré. Vos observations et exercices apparaîtront ici au fil du temps.
          </p>
        </Card>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {entries.map((e, i) => (
          <Card key={i} c={c}>
            <div style={{ fontSize: 11, color: c.textSoft, marginBottom: 6 }}>
              {new Date(e.date).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
            </div>
            {e.type === "check-in" ? (
              <div style={{ fontSize: 14, color: c.text }}>
                Observation — intensité {e.intensite}/10
                {e.etat && <> · {NS_STATES.find((s) => s.id === e.etat)?.label}</>}
                {e.ffff && FFFF_INFO.find((f) => f.id === e.ffff) && <> · {FFFF_INFO.find((f) => f.id === e.ffff).label}</>}
              </div>
            ) : (
              <div style={{ fontSize: 14, color: c.text }}>
                Exercice « {e.exercice} » — effet ressenti : {e.effet}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function Settings({ c, theme, toggleTheme, onBack, onWipe }) {
  const [confirm, setConfirm] = useState(false);
  return (
    <div>
      <BackRow c={c} onBack={onBack} />
      <ScreenTitle c={c}>Réglages</ScreenTitle>

      <Card c={c} style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: c.text, fontSize: 15 }}>Apparence</span>
          <button onClick={toggleTheme} style={{ background: c.bgAlt, border: "none", borderRadius: 999, padding: "8px 14px", fontSize: 13, color: c.text, cursor: "pointer" }}>
            {theme === "light" ? "Clair" : "Sombre"}
          </button>
        </div>
      </Card>

      <Card c={c} style={{ marginBottom: 14 }}>
        <p style={{ margin: "0 0 10px", fontSize: 13, color: c.textSoft, lineHeight: 1.6 }}>
          Vos données (repères de sécurité, suivi personnel) sont enregistrées uniquement pour votre usage. Elles
          concernent potentiellement votre santé ou votre vécu émotionnel et méritent une attention particulière.
        </p>
        {!confirm ? (
          <Btn c={c} variant="warn" onClick={() => setConfirm(true)}>Supprimer toutes mes données</Btn>
        ) : (
          <div>
            <p style={{ fontSize: 13, color: c.text, marginBottom: 10 }}>
              Cette action est définitive. Confirmer ?
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn c={c} variant="warn" onClick={onWipe}>Oui, tout supprimer</Btn>
              <Btn c={c} variant="secondary" onClick={() => setConfirm(false)}>Annuler</Btn>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
